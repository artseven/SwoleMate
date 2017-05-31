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
// Uploading files
const myUploader = multer({
   dest: path.join(__dirname, '../public/uploads/')
});
// <form method="post" action="/workout">
workoutRouter.post('/workout',
// We need to be logged in to create workouts
  ensure.ensureLoggedIn('/login'),
//<input type="file" name="workoutPhoto">
  myUploader.single('workoutPhoto'),

  (req, res, next) => {
    console.log('FILE UPLOAD---------------------');
    console.log(req.file);
    const theWorkout = new Workout({
      strength : {
      strName : req.body.strName,
      weight: req.body.weight,
      reps: req.body.reps,
    },
      // photoAddress: `/uploads/${req.file.filename}`,
      performer: req.user._id
    });

    theWorkout.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('success', 'Your workout was saved succesfully');

      res.redirect('/workout');
    });
  }
);


module.exports = workoutRouter;
