const express       = require('express');
const ensure        = require('connect-ensure-login');
const User          = require('../models/user.js');
const Workout       = require('../models/workout.js');
const path          = require('path');
const multer        = require('multer');
const bcrypt        = require('bcrypt');

const workoutRouter = express.Router();

workoutRouter.get('/workout',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    Workout.find(
      { performer: req.user._id },
      (err, workoutList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('workouts/workouts-list-view.ejs', {
          workouts: workoutList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);
workoutRouter.get('/workout/new',
// We need to be logged in to create rooms
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    res.render('workouts/new-workout-view.ejs');
  }
);
// // Uploading files
// const myUploader = multer({
//    dest: path.join(__dirname, '../public/uploads/')
// });
// // <form method="post" action="/rooms">
// workoutRouter.post('/workout',
// // We need to be logged in to create rooms
//   ensure.ensureLoggedIn('/login'),
// //<input type="file" name="roomPhoto">
//   myUploader.single('workoutPhoto'),
//
//   (req, res, next) => {
//     console.log('FILE UPLOAD---------------------');
//     console.log(req.file);
//
//     const theWorkout = new Workout({
//       name: req.body.roomName,
//       description: req.body.roomDescription,
//       photoAddress: `/uploads/${req.file.filename}`,
//       owner: req.user._id
//     });
//
//     theRoom.save((err) => {
//       if (err) {
//         next(err);
//         return;
//       }
//
//       req.flash('success', 'Your room was saved succesfully');
//
//       res.redirect('/rooms');
//     });
//   }
// );


module.exports = workoutRouter;
