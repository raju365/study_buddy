/*
 * -------------------------------------------------------
 * File : auth.controller.js
 * Description : Handles user authentication
 *               (Register & Login) for Study Buddy
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
 * Register a new student
 */
async function registerUser(req, res) {
  try {
    const {
      fullName: { firstName, lastName },
      email,
      password,
      grade,
      subjects,
    } = req.body;

    // Check if user already exists
    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      fullName: { firstName, lastName },
      email,
      password: hashedPassword,
      grade: grade || "",
      subjects: subjects || [],
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store token inside httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        grade: user.grade,
        subjects: user.subjects,
        streak: user.streak,
        doubtsSolved: user.doubtsSolved,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * Login existing student
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        grade: user.grade,
        subjects: user.subjects,
        streak: user.streak,
        doubtsSolved: user.doubtsSolved,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * Logout — clear the auth cookie
 */
async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
}

/*
 * Return the currently logged-in user
 */
async function getMe(req, res) {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};