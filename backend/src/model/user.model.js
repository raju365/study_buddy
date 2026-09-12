/*
 * -------------------------------------------------------
 * File : user.model.js
 * Description : User schema — represents a registered
 *               student on Study Buddy
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full name of the student
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },

    // Email — must be unique for every account
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Hashed password — excluded from queries by default
    password: {
      type: String,
      required: true,
      select: false,
    },

    // Class/grade — helps tailor doubt difficulty later
    grade: {
      type: String,
      default: "",
    },

    // Subjects the student is interested in
    subjects: {
      type: [String],
      default: [],
    },

    // Gamification — tracked here for quick access on dashboard
    streak: {
      type: Number,
      default: 0,
    },

    doubtsSolved: {
      type: Number,
      default: 0,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;