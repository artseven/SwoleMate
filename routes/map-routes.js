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




module.exports = mapRouter;
