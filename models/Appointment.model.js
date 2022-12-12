const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
  procedure: {
    type: Schema.Types.ObjectId,
    ref: 'Procedure',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: String,
  status: String,
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;
