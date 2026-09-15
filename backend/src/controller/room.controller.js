/*
 * -------------------------------------------------------
 * File : room.controller.js
 * Description : REST endpoints for finding/creating
 *               study rooms (real-time part lives in
 *               sockets/socket.server.js)
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const roomModel = require("../model/room.model");

/*
 * Find an active room for a topic, or create one.
 * This is what the "Join live room" button calls.
 */
async function findOrCreateRoom(req, res) {
  try {
    const { subject, topic } = req.body;

    let room = await roomModel.findOne({
      subject,
      topic,
      status: "active",
    });

    if (!room) {
      room = await roomModel.create({
        subject,
        topic,
        createdBy: req.user._id,
        activeMembers: [req.user._id],
      });
    }

    return res.status(200).json({ room });
  } catch (error) {
    console.error("Find Or Create Room Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * List currently active rooms — powers the "Study Rooms" page
 */
async function getActiveRooms(req, res) {
  try {
    const rooms = await roomModel
      .find({ status: "active" })
      .populate("activeMembers", "fullName")
      .sort({ lastActivityAt: -1 });

    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("Get Active Rooms Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { findOrCreateRoom, getActiveRooms };