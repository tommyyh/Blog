require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');

const app = express();

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// Passport
app.use(passport.initialize());
app.use(passport.session())

// Flash
app.use(flash());

// EJS
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Method override
app.use(methodOverride('_method'));

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Passport config
const initialize = require('./passport/passport');
initialize(passport);

// Routes
app.use('/articles', require('./routes/articles'));
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

// Port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));