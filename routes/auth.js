const router = require('express').Router()
const config = require('config')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const User = require('../models/User')
const Notification = require('../models/Notification')
const pusher = require('../utils/pusher')

const HIDE_PRIVATE_INFO = '-password -pwResetToken -pwResetTokenExpiry'

// DESC				verify user token
// ACCESS			private
// ENDPOINT		/api/auth
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select(HIDE_PRIVATE_INFO)
    if (!user) return res.status(404).send({ message: 'User not found' })

    return res.send(user)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC				register new user in the system
// ACCESS			public
// ENDPOINT		/api/auth/register
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Should be an email').isEmail(),
    check('password', 'Password at least 6 characters').isLength({ min: 6 }),
    check('phone', 'Phone is required').isLength({ min: 8 }),
    check('dateOfBirth', 'Please provide a date of birth').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ message: errors.array() })

    const { firstName, lastName, email, password, phone, dateOfBirth } = req.body

    try {
      const userExists = await User.findOne({ email })
      if (userExists) return res.status(400).send({ message: 'Email already taken' })

      const allUsers = await User.find().select(HIDE_PRIVATE_INFO)
      const doctors = allUsers.filter(user => user.isDoctor)
      const patients = allUsers.filter(user => !user.isDoctor)

      // convert doctors to their IDs and amount of patients they have
      // structure: [{ doc1_Id: 4, doc2_Id: 3 }] etc.
      const patientsToDoctors = doctors.reduce((acc, doc) => {
        const patientsForDoc = []

        for (let patient of patients) {
          if (patient.doctorID.toString() === doc._id.toString()) {
            patientsForDoc.push(patient)
          }
        }
        acc.push({ id: doc._id, amount: patientsForDoc.length })

        return acc
      }, [])

      // sort that array from least patients to most and grab the first doctor
      const targetDocID = patientsToDoctors.sort((a, b) => a.amount - b.amount)[0].id
      const docToAssign = doctors.find(
        doc => doc._id.toString() === targetDocID.toString()
      )

      const newUser = new User({
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        doctorID: docToAssign._id,
        doctorName: docToAssign.fullName
      })

      newUser.password = await bcrypt.hash(password, 8)
      await newUser.save()

      const token = jwt.sign({ id: newUser._id }, config.get('jwtSecret'), {
        expiresIn: 3600
      })

      return res.status(201).send({ token })
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC				login user into their account
// ACCESS			public
// ENDPOINT		/api/auth/login
router.post(
  '/login',
  [
    check('email', 'Should be an email').isEmail(),
    check('password', 'Password at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ message: errors.array() })

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(400).send({ message: 'Invalid credentials' })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(400).send({ message: 'Invalid credentials' })

      const token = jwt.sign({ id: user._id }, config.get('jwtSecret'), {
        expiresIn: 3600
      })

      return res.send({ token })
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC				update user account
// ACCESS			private
// ENDPOINT		/api/auth
router.put('/', auth, async (req, res) => {
  const { language, phone } = req.body

  try {
    const user = await User.findById(req.userID).select(HIDE_PRIVATE_INFO)
    if (!user) return res.status(404).send({ message: 'User not found' })

    if (language) user.language = language
    if (phone) user.phone = phone
    await user.save()

    return res.send(user)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC				delete user account and their notifications
// ACCESS			private (patients only)
// ENDPOINT		/api/auth
router.delete('/', auth, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.userID)
    if (!userToDelete) return res.status(404).send({ message: 'User not found' })
    if (userToDelete.isDoctor) return res.status(403).send({ message: 'Access denied' })

    await Notification.deleteMany({ receiver: req.userID })
    await userToDelete.remove()

    // send notification to their doctor that they removed their account
    const newNotification = new Notification({
      receiver: userToDelete.doctorID,
      title: 'Your patient has deleted their account',
      message: `Your patient ${userToDelete.fullName} has deleted their account. You can still see your appointment history with them.`
    })

    await newNotification.save()
    pusher.trigger(`user_${userToDelete.doctorID}`, 'notification', newNotification)

    return res.send({ message: 'Account deleted successfully' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

module.exports = router
