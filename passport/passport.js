const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Models
const User = require('../models/User');

// Passport config
const initialize = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (user == null) {
          return done(null, false, { message: 'No user with that email' });
        }

        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    })
  });
}

module.exports = initialize;