const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User   = require('./user.js');

const workoutSchema = new Schema(
  // 1st arg -> fields of documents of this collection
  {
    strength: {
      strName: { type: String},
      weight: { type: Number},
      reps: { type: Number}
    },
    cardio: {
      carName: { type: String},
      time: { type: Number},
      calories: { type: Number},
      distance: { type: Number}
    },
    performer: { type: Schema.Types.ObjectId},
    privacy: { type: String},
    date: { type: Date, default: new Date() },
    address: {type: String}
  },
    //2nd arg -> additional options
  {
    // Adds "createdAt" and "updatedAt" fields
    timestamps: true,

  }
);

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
