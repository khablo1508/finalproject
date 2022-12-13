const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const Request = require('../models/Request.model');

router.get('/admin-profile', (req, res, next) => {
  Request.find()
    .populate({
      path: 'appointment',
      populate: {
        path: 'procedure',
        model: 'Procedure',
      },
    })
    .populate({
      path: 'appointment',
      populate: {
        path: 'user',
        model: 'User',
      },
    })
    .then((requestsFromDb) => {
      res.json(requestsFromDb);
    });
});

router.get('/user-profile/:profileId', (req, res, next) => {
  const { profileId } = req.params;

  User.findById(profileId)
    .populate({
      path: 'appointments',
      populate: {
        path: 'procedure',
        model: 'Procedure',
      },
    })
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((err) => next(err));
});

router.put('/update-profile/:profileId', (req, res, next) => {
  const { profileId } = req.params;

  const { newUsername, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  // check if new username or new email are taken
  User.findOne({ username: newUsername }).then((foundUser) => {
    if (foundUser) {
      // username is taken -> error message
      res.status(401).json({ message: 'This email is taken' });
      return;
    }
  });

  if (newPassword === '' && newUsername === '') {
    User.findByIdAndUpdate(
      profileId,
      {
        username,
        password,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  } else if (newPassword === '' && newUsername !== '') {
    User.findByIdAndUpdate(
      profileId,
      {
        username: newUsername,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  } else if (newPassword !== '' && newUsername === '') {
    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(
      profileId,
      {
        password: hashedNewPassword,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  } else if (newPassword !== '' && newUsername !== '') {
    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
    User.findByIdAndUpdate(
      profileId,
      {
        password: hashedNewPassword,
        username: newUsername,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  }
});

module.exports = router;
