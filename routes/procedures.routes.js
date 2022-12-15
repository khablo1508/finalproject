const express = require('express');
const router = express.Router();
const Procedure = require('../models/Procedure.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const Request = require('../models/Request.model');

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

// PROCEDURE ROUTES
router.get('/edit-procedure/:procedureId', (req, res, next) => {
  const { procedureId } = req.params;

  Procedure.findById(procedureId)
    .then((foundProcedure) => res.json(foundProcedure))
    .catch((err) => next(err));
});

router.put('/edit-procedure/:procedureId', (req, res, next) => {
  const { procedureId } = req.params;

  if (req.body.newTitle) {
    Procedure.findByIdAndUpdate(
      procedureId,
      { title: req.body.newTitle },
      { new: true }
    ).then((updProc) => res.json(updProc));
  } else if (req.body.newDescription) {
    Procedure.findByIdAndUpdate(
      procedureId,
      { description: req.body.newDescription },
      { new: true }
    ).then((updProc) => res.json(updProc));
  } else if (req.body.newDuration) {
    Procedure.findByIdAndUpdate(
      procedureId,
      { description: req.body.newDescription },
      { new: true }
    ).then((updProc) => res.json(updProc));
  } else {
    Procedure.findByIdAndUpdate(
      procedureId,
      { price: req.body.newPrice },
      { new: true }
    ).then((updProc) => res.json(updProc));
  }
});

router.delete('/edit-procedure/:procedureId', (req, res, next) => {
  const { procedureId } = req.params;

  Procedure.findByIdAndRemove(procedureId)
    .then(() =>
      res.json({
        message: `Procedure with ${procedureId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
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

router.put('/create-appointment/:appId', (req, res, next) => {
  const { appDate, userId, appTime } = req.body;
  const { appId } = req.params;

  Appointment.findByIdAndUpdate(
    appId,
    { date: appDate, time: appTime },
    { new: true }
  )
    .then((updatedApp) => {
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

router.post('/create-appointment/:appId', (req, res, next) => {
  const { appId } = req.params;

  Appointment.findById(appId)
    .then((foundAppointment) => {
      return Request.create({
        decision: 'pending',
        appointment: foundAppointment._id,
      });
    })
    .then((createdReq) => {
      res.json(createdReq);
    });
});

// REQUESTS ROUTES
router.put('/admin-profile', (req, res, next) => {
  const { appStatus, appId, decision, reqId } = req.body;
  let promReqUpdate;
  let promAppUpdate;
  if (decision === 'approved') {
    promReqUpdate = Request.findByIdAndUpdate(
      reqId,
      { decision: 'approved' },
      { new: true }
    );
    promAppUpdate = Appointment.findByIdAndUpdate(
      appId,
      { status: 'approved' },
      { new: true }
    );
  } else {
    promReqUpdate = Request.findByIdAndUpdate(
      reqId,
      { decision: 'declined' },
      { new: true }
    );
    promAppUpdate = Appointment.findByIdAndUpdate(
      appId,
      { status: 'declined' },
      { new: true }
    );
  }
  Promise.all([promReqUpdate, promAppUpdate]).then((values) => {
    res.json(values);
  });
});

module.exports = router;
