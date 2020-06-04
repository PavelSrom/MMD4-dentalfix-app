const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patientName: {
    type: String
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  message: {
    type: String
  }
})

module.exports = Appointment = mongoose.model('Appointment', appointmentSchema)
