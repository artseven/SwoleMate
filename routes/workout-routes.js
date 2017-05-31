const express  = require('express');
const ensure   = require('connect-ensure-login');
const workoutRouter = express.Router();
const User     = require('../models/user.js');
const Workout  = require('../models/workout.js');
const path     = require('path');
const multer   = require('multer');
const bcrypt   = require('bcrypt');


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

workoutRouter.get('/workouts/new',
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
// <form method="post" action="/rooms">
workoutRouter.post('/workouts',
// We need to be logged in to create rooms
  ensure.ensureLoggedIn('/login'),
//<input type="file" name="roomPhoto">
  myUploader.single('roomPhoto'),

  (req, res, next) => {
    console.log('FILE UPLOAD---------------------');
    console.log(req.file);

    const theRoom = new Room({
      name: req.body.roomName,
      description: req.body.roomDescription,
      photoAddress: `/uploads/${req.file.filename}`,
      owner: req.user._id
    });

    theRoom.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('success', 'Your room was saved succesfully');

      res.redirect('/rooms');
    });
  }
);


workoutRouter.get('/rooms',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    Room.find(
      { owner: req.user._id },
      (err, roomsList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('rooms/rooms-list-view.ejs', {
          rooms: roomsList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);

module.exports = workoutRouter;
