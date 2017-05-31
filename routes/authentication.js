const express  = require('express');
const bcrypt   = require('bcrypt');
const passport = require('passport');
const ensure = require('connect-ensure-login');

const User    = require('../models/user.js');


const authRoutes = express.Router();

authRoutes.get('/signup',
  //           redirect to '/' if you ARE logged in"
  ensure.ensureNotLoggedIn('/'),

 (req, res, next) => {
  // If logged in already, redirects to home page
  // if (req.user) {
  //   res.redirect('/');
  //   return;
  // }
  res.render('auth/signup-view.ejs');
});

authRoutes.post('/signup',
  ensure.ensureNotLoggedIn('/'),

 (req, res, next) =>{
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

// Don't let users submit blank usernames or passwords
  if (signupUsername === '' || signupPassword === '') {
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please provide both username and password'
    });
    return;
  }
// Check password length, characters, etc.
  User.findOne(
    // 1st arg -> criteria of the findOne (which documents)
    { username: signupUsername},
    // 2nd arg -> projection (which fields)
    { username: 1 },
    // 3rd arg -> callback
    (err, foundUser) =>{
      if (err) {
        next(err);
        return;
      }
      // Don't let the user register if the username is taken
      if (foundUser) {
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Username is taken'
        });
        return;
      }
      //  We are good to go, time to save the user.

      // Encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(signupPassword, salt);
      console.log(hashPass);

      // Create the user
      const theUser = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.signupEmail,
        username: signupUsername,
        encryptedPassword: hashPass,
        gender: req.body.gender,
        dob: req.body.bday

      });
      // Save it
      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        // store a message in the box to display after the redirect
        req.flash(
          // 1st arg -> key of the message
          'success',
          // 2nd arg -> the actual message
          'You have registered successfully!'
        );

      // Redirect to home page if save is successful
        res.redirect('/login');
      });
    }
  );
}
);

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
    //      default name for error messages in Passport
  });
});
// <form method="post" action="/login">
authRoutes.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    successFlash: true,    //req.flash('success')
    failureRedirect: '/login',
    failureFlash: true
  } )
);

authRoutes.get('/logout', (req, res, next) => {
  // req.logout() method provided by Passport
  req.logout();

  req.flash('success', 'You have logged out successfully');
  res.redirect('/');
});

// Link to the address to log in with Facebook
authRoutes.get('/auth/facebook', passport.authenticate('facebook'));

// Where Facebook comes back to after the user has accepted/rejected
// callbackURL: '/auth/facebook/callback'
//                        |
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


authRoutes.get('/auth/google', passport.authenticate('google', {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect:'/login'
}));

authRoutes.get('/profile', ensure.ensureLoggedIn('/login'), (req, res) => {
    res.render('auth/profile', {
        user : req.user
    });
});

authRoutes.get('/logout', ensure.ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/');
});


module.exports = authRoutes;
