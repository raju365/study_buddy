const express = require("express");
const doubtControllers = require("../controller/doubt.controller");
const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

/*
 * POST /api/doubts/ask
 */
router.post("/ask", authUser, doubtControllers.askDoubt);

/*
 * GET /api/doubts/me
 */
router.get("/me", authUser, doubtControllers.getMyDoubts);

/*
 * GET /api/doubts/progress
 */
router.get("/progress", authUser, doubtControllers.getProgressStats);

module.exports = router;