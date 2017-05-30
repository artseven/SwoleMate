const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  // 1st arg -> fields of documents of this collection
  {
    // All users
    firstName: { type: String },
    lastName: { type: String},
    role: {
       type: String,
       enum: [ 'normal user', 'admin'],
       default: 'normal user'
    },
    gender: {type: String},
    // Traditional registration users
    username: { type: String },
    dob: {type: Date, default: new Date()},
    email: {type: String},
    encryptedPassword: { type: String },


    // Login with Facebook users
    facebookID: { type: String },

    // Login with Google users
    googleID: { type: String}
  },
    //2nd arg -> additional options
  {
    // Adds "createdAt" and "updatedAt" fields
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
