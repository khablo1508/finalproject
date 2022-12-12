const express = require('express');
const router = express.Router();
const Procedure = require('../models/Procedure.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');

// SERVICES ROUTES
router.get('/services', (req, res, next) => {
  Procedure.find()
    .then((proceduresFromDB) => {
      res.json(proceduresFromDB);
    })
    .catch((err) => console.log(err));
});

router.post('/services', (req, res, next) => {
  const { id, user } = req.body;

  Appointment.create({ status: 'pending', procedure: id, user })
    .then((undatedAppointment) => {
      // console.log('app created');
      res.status(201).json(undatedAppointment);
      return;
    })
    .catch((err) => next(err));
});

// APPOINTMENT ROUTES
router.get('/create-appointment/:appId', (req, res, next) => {
  const { appId } = req.params;

  Appointment.findById(appId)
    .populate('procedure')
    .then((foundAppointment) => {
      console.log('router.get result: ', foundAppointment);
      res.json(foundAppointment);
    })
    .catch((err) => next(err));
});

router.post('/create-appointment/:appId', (req, res, next) => {
  const { appDate, userId } = req.body;
  const { appId } = req.params;

  Appointment.findByIdAndUpdate(appId, { date: appDate }, { new: true })
    .then((updatedApp) => {
      console.log('added date', updatedApp);
      return User.findByIdAndUpdate(
        userId,
        { $push: { appointments: updatedApp._id } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      console.log('user updated', updatedUser);
      res.json(updatedUser);
    });
});

module.exports = router;
