/*
 * -------------------------------------------------------
 * File : auth.middleware.js
 * Description : Verifies JWT from httpOnly cookie and
 *               attaches the logged-in user to req.user
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authUser };