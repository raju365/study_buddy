/*
 * -------------------------------------------------------
 * File : message.model.js
 * Description : Stores chat messages sent inside a
 *               study room, so history survives refresh
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

messageSchema.index({ room: 1, createdAt: 1 });

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;