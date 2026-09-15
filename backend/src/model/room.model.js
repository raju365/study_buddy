/*
 * -------------------------------------------------------
 * File : room.model.js
 * Description : Room schema — represents a live study
 *               room created for a specific topic
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
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

    // Student who created/triggered the room
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Students currently active inside the room
    activeMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // Rooms auto-close after inactivity — keeps sessions focused
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

roomSchema.index({ subject: 1, topic: 1, status: 1 });

const roomModel = mongoose.model("room", roomSchema);

module.exports = roomModel;