const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User   = require('./user.js');

const workoutSchema = new Schema(
  // 1st arg -> fields of documents of this collection
  {
    strength: {
      weight: { type: Number},
      reps: { type: Number}
    },
    cardio: {
      time: { type: Number},
      calories: { type: Number},
      distance: { type: Number}
    },
    performer: { type: Schema.Types.ObjectId},
    date: { default: new Date() }
  },
    //2nd arg -> additional options
  {
    // Adds "createdAt" and "updatedAt" fields
    timestamps: true
  }
);

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = User;
