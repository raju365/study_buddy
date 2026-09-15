/*
 * -------------------------------------------------------
 * File : socket.server.js
 * Description : Socket.IO setup — handles joining rooms,
 *               live chat messages, and presence
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../model/user.model");
const roomModel = require("../model/room.model");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  /*
   * Authenticate socket connection using the same
   * httpOnly JWT cookie used by REST routes
   */
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.fullName.firstName}`);

    /*
     * Join a study room — adds user to socket room
     * and updates activeMembers in DB
     */
    socket.on("room:join", async ({ roomId }) => {
      socket.join(roomId);

      await roomModel.findByIdAndUpdate(roomId, {
        $addToSet: { activeMembers: socket.user._id },
        lastActivityAt: new Date(),
      });

      io.to(roomId).emit("room:memberJoined", {
        userId: socket.user._id,
        name: socket.user.fullName.firstName,
      });
    });

    /*
     * Broadcast a chat message to everyone in the room
     */
    socket.on("room:message", ({ roomId, message }) => {
      io.to(roomId).emit("room:message", {
        senderId: socket.user._id,
        senderName: socket.user.fullName.firstName,
        message,
        sentAt: new Date(),
      });
    });

    /*
     * Leave room — cleanup on explicit leave
     */
    socket.on("room:leave", async ({ roomId }) => {
      socket.leave(roomId);

      await roomModel.findByIdAndUpdate(roomId, {
        $pull: { activeMembers: socket.user._id },
      });

      io.to(roomId).emit("room:memberLeft", { userId: socket.user._id });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.fullName.firstName}`);
    });
  });

  return io;
}

module.exports = initSocket;