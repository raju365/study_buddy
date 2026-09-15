const express = require("express");
const roomControllers = require("../controller/room.controller");
const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

/*
 * POST /api/rooms/find-or-create
 */
router.post("/find-or-create", authUser, roomControllers.findOrCreateRoom);

/*
 * GET /api/rooms/active
 */
router.get("/active", authUser, roomControllers.getActiveRooms);

module.exports = router;