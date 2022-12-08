const express = require('express');
const router = express.Router();
const Procedure = require('../models/Procedure.model');

router.get('/services', (req, res, next) => {
  Procedure.find()
    .then((proceduresFromDB) => {
      res.json(proceduresFromDB);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
