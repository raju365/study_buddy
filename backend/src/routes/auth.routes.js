const express = require("express");
const authControllers = require("../controller/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

/*
 * POST /api/auth/register
 */
router.post("/register", authControllers.registerUser);

/*
 * POST /api/auth/login
 */
router.post("/login", authControllers.loginUser);

/*
 * POST /api/auth/logout
 */
router.post("/logout", authUser, authControllers.logoutUser);

/*
 * GET /api/auth/me
 */
router.get("/me", authUser, authControllers.getMe);

module.exports = router;