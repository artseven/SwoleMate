const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const multer       = require('multer');
const layouts      = require('express-ejs-layouts');
const session      = require('express-session');
const passport     = require('passport');
const bcrypt       = require('bcrypt');
const flash        = require('connect-flash');

// Tell node to run the code contained in this file
// (this sets up passport and our strategies)
require('./config/passport-config.js');

mongoose.connect('mongodb://localhost/swolemate');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'SwoleMate - get swole with the help of pro';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  key: "ArtKey",
  secret: 'ArtSecret',
  cookie:
  {
    maxAge: 10000000,
    // path: '/'
  },
  // these two options are there to prevent warnings
  resave: true,
  saveUninitialized: true
}) );

app.use(flash());

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());


// PASSPORT GOES THROUGH THIS
// 1. Our form
// 2. LocalStrategy callback
// 3.(if successful) passport.serializeUser()
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

// Only if logged in
//  user: req.user for all renders
// Also after passport middleware
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});
// --------------ROUTES---------------------------------------|
const index = require('./routes/index');                    //|
app.use('/', index);                                        //|
const myAuthRoutes = require('./routes/authentication.js'); //|
app.use('/', myAuthRoutes);                                 //|
const workoutRoutes = require('./routes/workout-routes');   //|
app.use('/',workoutRoutes);                                 //|
const userRoutes = require('./routes/users-routes.js');     //|
app.use('/',userRoutes);                                    //|
// -----------------------------------------------------------|
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
