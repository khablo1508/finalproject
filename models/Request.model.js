const { Schema, model } = require('mongoose');

const requestSchema = new Schema({
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  decision: String,
});

const Request = model('Request', requestSchema);

module.exports = Request;
