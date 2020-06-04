const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = Notification = mongoose.model('Notification', notificationSchema)
