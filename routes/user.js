const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

// Models
const User = require('../models/User');

// Register route
router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('user/register');
});

// Register post route
router.post('/register', checkNotAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword
  });

  try {
    await user.save();
    res.redirect('/user/login');
  } catch {
    res.redirect('/user/register');
  }
});

// Login route
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('user/login');
});

// Login post route
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}));

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

module.exports = router;