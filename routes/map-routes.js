const express       = require('express');
const ensure        = require('connect-ensure-login');
const User          = require('../models/user.js');
const Workout       = require('../models/workout.js');
const path          = require('path');
const multer        = require('multer');
const bcrypt        = require('bcrypt');

const mapRouter = express.Router();

mapRouter.get('/map',
  (req, res, next) => {
    res.render('maps/map-view.ejs');
  }
);

mapRouter.get('/workout/map',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    Workout.find(
      { owner: req.user._id },
      (err, workoutList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('maps/my-map-view.ejs', {
          workouts: workoutList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);




module.exports = mapRouter;
