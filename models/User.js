const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  isDoctor: {
    type: Boolean,
    default: false
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  doctorName: {
    type: String
  },
  language: {
    type: String,
    default: 'en'
  },
  pwResetToken: {
    type: String
  },
  pwResetTokenExpiry: {
    type: Date
  }
})

module.exports = User = mongoose.model('User', userSchema)
