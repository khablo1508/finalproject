const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const saltRounds = 10;

/* =============
POST ROUTES
================ */

// SIGNUP
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
  // Check if email or password or name are provided
  if (username === '' || email === '' || password === '') {
    res.status(400).json({ message: 'All fields are necessary!' });
    return;
  }
  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Please use a valid email address!' });
    return;
  }
  // check if password contains a number,a lowercase, an uppercase and is at least 6 symbols long
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter!',
    });
    return;
  }
  // Check if the user exists
  User.findOne({ email })
    .then((foundUser) => {
      // user exists -> send an error message
      if (foundUser) {
        res.status(400).json({ message: 'User already exists!' });
        return;
      }
      // user doesn't exist-> proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      const { username, email, _id } = createdUser;
      // Create a new object that doesn't expose the password
      const user = { username, email, _id };
      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err));
});

// SIGNIN
router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;
  // Check if no email or password
  if (email === '' || password === '') {
    res.status(400).json({ message: 'All fields are necessary!' });
    return;
  }
  // Check if the user already exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // user is not found -> error message
        res.status(401).json({ message: 'User not found' });
        return;
      }
      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, username } = foundUser;
        // Create an object that will be set as the token payload
        const payload = { _id, email, username };
        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '6h',
        });
        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: 'Wrong password!' });
      }
    })
    .catch((err) => next(err));
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
