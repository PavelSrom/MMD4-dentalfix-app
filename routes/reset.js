const router = require('express').Router()
const crypto = require('crypto')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const sgMail = require('../utils/sendgrid')
const pusher = require('../utils/pusher')

router.post('/requested', async (req, res) => {
  const { email } = req.body

  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) return res.status(500).send({ message: err.message })

      const user = await User.findOne({ email })
      if (!user) return res.status(400).send({ message: 'No account with this email' })

      const token = buffer.toString('hex')
      user.pwResetToken = token
      user.pwResetTokenExpiry = Date.now() + 3600000

      await user.save()

      sgMail.send({
        from: '1074227@ucn.dk',
        to: user.email,
        subject: 'DentalFix app - password reset',
        html: `
					<p>You requested a password reset. Open the link below in your browser:</p>
					<p>localhost:3000/reset/${token}</p>
					<p>https://dentalfix.herokuapp.com/reset/${token}</p>
				`
      })

      return res.send({ message: 'Reset link sent' })
    })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.post('/confirm', async (req, res) => {
  const { newPassword, token } = req.body

  try {
    const user = await User.findOne({
      pwResetToken: token,
      pwResetTokenExpiry: { $gt: Date.now() }
    })
    if (!user) return res.status(400).send({ message: 'Invalid or expired request' })

    user.password = await bcrypt.hash(newPassword, 8)
    await user.save()

    const newNotification = new Notification({
      receiver: user._id,
      title: 'Password reset',
      message: `Your password has been reset successfully.`
    })

    await newNotification.save()
    pusher.trigger(`user_${user._id}`, 'notification', newNotification)

    return res.send({ message: 'Password has been reset' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

module.exports = router
