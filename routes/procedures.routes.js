const express = require('express');
const router = express.Router();
const Procedure = require('../models/Procedure.model');
const User = require('../models/User.model');

router.get('/services', (req, res, next) => {
  Procedure.find()
    .then((proceduresFromDB) => {
      res.json(proceduresFromDB);
    })
    .catch((err) => console.log(err));
});

router.post('/services', (req, res, next) => {
  const { id, user } = req.body;

  User.findByIdAndUpdate(
    user._id,
    { $push: { chosenProcedure: id } },
    { new: true }
  ).then((updatedUser) => {
    res.json(updatedUser);
  });
});

module.exports = router;
