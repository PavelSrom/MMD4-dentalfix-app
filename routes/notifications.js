const router = require('express').Router()
const Notification = require('../models/Notification')
const auth = require('../middleware/auth')

// DESC				get all user's notifications on login
// ACCESS			private
// ENDPOINT		/api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.userID }).sort({
      createdAt: -1 // sort from newest to oldest
    })

    return res.send(notifications)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC				delete a notification (mark as read)
// ACCESS			private
// ENDPOINT		/api/notifications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const notifToDelete = await Notification.findById(req.params.id)
    if (!notifToDelete) return res.status(404).send({ message: 'Notification not found' })
    if (notifToDelete.receiver.toString() !== req.userID)
      return res.status(403).send({ message: 'Access denied' })

    await notifToDelete.remove()

    return res.send({ message: 'Notification removed successfully' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

module.exports = router
