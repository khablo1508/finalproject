const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const Request = require('../models/Request.model');

// ADMIN ROUTES
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

// USER ROUTES
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

  const { newPassword, newTel } = req.body;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  if (newPassword === '' && newTel !== '') {
    User.findByIdAndUpdate(
      profileId,
      {
        tel: newTel,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  } else if (newPassword !== '' && newTel === '') {
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
  } else if (newPassword !== '' && newTel !== '') {
    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(
      profileId,
      {
        password: hashedNewPassword,
        tel: newTel,
      },
      { new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => res.json(error));
  }
});

router.post(
  '/user-profile/:profileId/upload-avatar',
  fileUploader.single('imageUrl'),
  (req, res, next) => {
    const { profileId } = req.params;

    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }

    User.findByIdAndUpdate(
      profileId,
      {
        imageUrl: req.file.path,
      },
      { new: true }
    ).then((updatedUser) => {
      res.json(updatedUser);
    });
  }
);

module.exports = router;
