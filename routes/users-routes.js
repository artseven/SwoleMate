const express = require('express');
const ensure  = require('connect-ensure-login');
const multer   = require('multer');
const path     = require('path');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.get('/profile', ensure.ensureLoggedIn('/login'), (req, res) => {
    res.render('auth/profile', {
        user : req.user
    });
});

const myUpload = multer({
  dest: path.join(__dirname, './public/uploads/profile-pic/')
});

userRouter.get('/profile/edit',
 ensure.ensureLoggedIn('/login'),
 myUpload.single('userPhoto'),
  (req, res) => {
    res.render('users/edit-profile-view', {
        user : req.user
    });
});
// routerThingy.get('/user/:id/edit', (req, res, next) => {
userRouter.get('/profile/edit',
//          redirects to /login if you are NOT logged in
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
  // If not 'ensureLoggedIn()' we would have to do this:
  // if (!req.user) {
  //   res.redirect('/login');
  //   return;
  // }
  //
  res.render('users/edit-profile-view.ejs', {
    successMessage: req.flash('success')
  });
});

// routerThingy.post('user/edit',
//   ensure.ensureLoggedIn ('/login'),
//   (req, res, next) => {
//     // req.save();
//     User.findByIdAndUpdate(
//       req.user._id,
//       {
//         //what to update
//         name: req.body.profileName,
//         username: req.body.profileUsername
//       },
//       (err, theUser) => {
//         if (err) {
//           next(err);
//           return;
//         }
//
//         req.flash('success', 'Changes saved');
//
//         res.redirect('/profile/edit');
//       }
//     );
//   }
// );

userRouter.post('/profile/edit',

  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

    User.findOne(
      { username: profileUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // if there's a user with the username and it's not you
        if (foundUser && !foundUser._id.equals(req.user._id)) {
          res.render('user/edit-profile-view.ejs', {
            errorMessage: 'Username already taken. 😤'
          });
          return;
        }

        // const profileChanges = {
        //   name: req.body.profileName,
        //   username: req.body.profileUsername
        // };

        // add updates from form
        req.user.firstName = req.body.firstName;
        req.user.lastName = req.body.lastName;
        req.user.gender = req.body.gender;
        req.user.dob = req.body.dob;
        req.user.photoAddress = req.body.photoAddress;
        req.body.email = req.body.email;

        // if both passwords are filled and the current password is correct
        if (currentPassword && newPassword
            && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          // add new encryptedPassword to the updates
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt);
          // profileChanges.encryptedPassword = hashPass;
          req.user.encryptedPassword = hashPass;
        }

        // save updates!
        req.user.save((err) => {
          if (err) {
            next(err);
            return;
          }

          req.flash('success', 'Changes saved. 👻');

          res.redirect('/profile/edit');
        });
      }
    );
  }
);


userRouter.get('/users', (req, res, next) => {
  if (! req.user || req.user.role !== 'admin') {
    // Show 404 page
    next();
    return;
  }

  User.find((err, usersList) => {
    if (err) {
      next(err);
      return;
    }

    res.render('user/users-list-view.ejs', {
      users: usersList,
      successMessage: req.flash('success')
    });
  });
});

userRouter.post('/users/:id/admin', (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    // show 404
    next();
    return;
  }

  User.findByIdAndUpdate(
    req.params.id,
    { role: 'admin'},
    (err, theUser) => {
      if (err) {
        next(err);
        return;
      }
      req.flash('success', `User "${theUser.name}" is now an admin`);

      res.redirect('/users');

    }
  );
});


module.exports = userRouter;
