const { Schema, model } = require('mongoose');

const procedureSchema = new Schema({
  title: String,
  description: String,
  duration: String,
  price: String,
});

const Procedure = model('Procedure', procedureSchema);

module.exports = Procedure;
