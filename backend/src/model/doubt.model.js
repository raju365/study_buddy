/*
 * -------------------------------------------------------
 * File : doubt.model.js
 * Description : Doubt schema — stores each question a
 *               student asks and the AI's answer
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    // Student who asked the doubt
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      enum: ["Math", "Science", "Coding", "General"],
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    // Whether the student later joined a live room for this doubt
    escalatedToRoom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Speeds up "students stuck on this topic right now" queries
doubtSchema.index({ subject: 1, topic: 1, createdAt: -1 });

const doubtModel = mongoose.model("doubt", doubtSchema);

module.exports = doubtModel;