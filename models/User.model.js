const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    imageUrl: String,
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    tel: {
      type: String,
      required: [true, 'Phone number is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
