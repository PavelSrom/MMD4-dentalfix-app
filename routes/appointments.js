const router = require('express').Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const pusher = require('../utils/pusher')
const { format, differenceInYears } = require('date-fns')
const User = require('../models/User')
const Appointment = require('../models/Appointment')
const Notification = require('../models/Notification')

// DESC				get schedule for that doctor (each doc has their own)
// ACCESS			private
// ENDPOINT		/api/appointments
router.get('/', auth, async (req, res) => {
  try {
    const me = await User.findById(req.userID).select('-password')
    if (!me) return res.status(404).send({ message: 'User not found' })

    // if the user is a doctor, return all their appointments
    if (me.isDoctor) {
      const allApps = await Appointment.find({ doctorID: req.userID })

      return res.send(allApps)
    }
    // if they're a patient, return all apps with the doctorID correctly handled
    const allApps = await Appointment.find({ doctorID: me.doctorID })

    return res.send(allApps)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC				get all user's appointments
// ACCESS			private
// ENDPOINT		/api/appointments/me
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.userID).select('-password')
    if (!me) return res.status(404).send({ message: 'User not found' })

    if (me.isDoctor) {
      // if I'm a doctor, I need to get all apps where my doctorID matches
      const allMyApps = await Appointment.find({ doctorID: req.userID }).sort({
        startAt: 1
      })

      return res.send(allMyApps)
    }
    // if I'm a patient, I need to get all apps where my patientID matches
    const allMyApps = await Appointment.find({ patientID: req.userID }).sort({
      startAt: 1
    })

    return res.send(allMyApps)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC				create a new appointment (heaviest endpoint)
// ACCESS			private
// ENDPOINT		/api/appointments
router.post(
  '/',
  [
    auth,
    check('treatment', 'Treatment is required').not().isEmpty(),
    check('startAt', 'Must be a valid date').not().isEmpty(),
    check('endAt', 'Must be a valid date').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ message: errors.array() })

    const { treatment, startAt, endAt, fullName, dateOfBirth, message } = req.body

    // if startAt is more in the future than endAt (should never happen, but still)
    const wrongDates =
      new Date(startAt) > new Date(endAt) ||
      new Date(startAt) < new Date() ||
      new Date(endAt) < new Date()
    if (wrongDates) return res.status(400).send({ message: 'Incorrect time entries' })

    try {
      const me = await User.findById(req.userID).select('-password')
      if (!me) return res.status(404).send({ message: 'User not found' })

      if (me.isDoctor) {
        // if doctor is making an appointment

        const targetSchedule = await Appointment.find({ doctorID: req.userID })
        const timeConflict = targetSchedule.some(
          app => app.startAt === startAt || app.endAt === endAt
        )
        if (timeConflict)
          return res.status(400).send({ message: 'Schedule conflict, pick another time' })
        if (!fullName || !dateOfBirth)
          return res.status(400).send({ message: 'Invalid form fields' })

        const newAppointment = new Appointment({
          patientName: `${fullName}, ${differenceInYears(
            new Date(),
            new Date(dateOfBirth)
          )}`, // edit later
          doctorID: req.userID,
          doctorName: me.fullName,
          treatment,
          startAt: new Date(startAt),
          endAt: new Date(endAt)
        })
        newAppointment.message = message ? message : '(No message provided)'

        await newAppointment.save()

        return res.status(201).send(newAppointment)
      } else {
        // if patient is making an appointment

        const targetSchedule = await Appointment.find({ doctorID: me.doctorID })
        const timeConflict = targetSchedule.some(
          app => app.startAt === startAt || app.endAt === endAt
        )
        if (timeConflict)
          return res.status(400).send({ message: 'Schedule conflict, pick another time' })

        if (fullName && dateOfBirth) {
          // they're making an appointment for someone else

          const newAppointment = new Appointment({
            patientID: req.userID,
            patientName: `${fullName}, ${differenceInYears(
              new Date(),
              new Date(dateOfBirth)
            )}`,
            doctorID: me.doctorID,
            doctorName: me.doctorName,
            treatment,
            startAt: new Date(startAt),
            endAt: new Date(endAt)
          })
          newAppointment.message = message ? message : '(No message provided)'

          await newAppointment.save()

          return res.status(201).send(newAppointment)
        }

        const newAppointment = new Appointment({
          patientID: req.userID,
          patientName: me.fullName,
          doctorID: me.doctorID,
          doctorName: me.doctorName,
          treatment,
          startAt: new Date(startAt),
          endAt: new Date(endAt)
        })
        newAppointment.message = message ? message : '(No message provided)'

        await newAppointment.save()

        return res.status(201).send(newAppointment)
      }
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC				delete an appointment
// ACCESS			private
// ENDPOINT		/api/appointments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const appToDelete = await Appointment.findById(req.params.id)
    if (!appToDelete) return res.status(404).send({ message: 'Appointment not found' })

    const me = await User.findById(req.userID).select('-password')
    if (!me) return res.status(404).send({ message: 'User not found' })

    // checks for permission
    if (me.isDoctor && appToDelete.doctorID.toString() !== req.userID)
      return res.status(403).send({ message: 'Access denied' })
    if (!me.isDoctor && appToDelete.patientID.toString() !== req.userID)
      return res.status(403).send({ message: 'Access denied' })

    await appToDelete.remove()

    if (me.isDoctor) {
      // if I'm a doctor and deleted it for a patient with account, patient receives a notification
      if (appToDelete.patientID) {
        const newNotification = new Notification({
          receiver: appToDelete.patientID,
          title: 'Your appointment has been canceled',
          message: `Your doctor ${me.fullName} has canceled your appointment on ${format(
            new Date(appToDelete.startAt),
            'MMM d y, hh:mm a'
          )}`
        })

        await newNotification.save()
        pusher.trigger(`user_${appToDelete.patientID}`, 'notification', newNotification)
      }
    } else {
      // if I'm a patient and deleted it, doctor receives a notification
      const newNotification = new Notification({
        receiver: appToDelete.doctorID,
        title: 'Your appointment has been canceled',
        message: `Your patient ${me.fullName} has canceled their appointment on ${format(
          new Date(appToDelete.startAt),
          'MMM d y, hh:mm a'
        )}`
      })

      await newNotification.save()
      pusher.trigger(`user_${appToDelete.doctorID}`, 'notification', newNotification)
    }

    return res.send({ message: 'Appointment deleted successfully' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

module.exports = router
