const express = require('express');

const router = express.Router();

// Home route
router.get('/', checkAuthenticated, (req, res) => {
  res.render('index');
});

// Logout route
router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/user/login');
});

// Block login, register routes when logged in
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/user/login');
}

module.exports = router;