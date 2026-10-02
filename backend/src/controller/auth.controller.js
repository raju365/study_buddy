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
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../service/mail.service");

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
/*
 * Update logged-in user's profile (name, grade, subjects)
 */
async function updateProfile(req, res) {
  try {
    const { firstName, lastName, grade, subjects } = req.body;

    const updates = {};
    if (firstName || lastName) {
      updates.fullName = {
        firstName: firstName || req.user.fullName.firstName,
        lastName: lastName || req.user.fullName.lastName,
      };
    }
    if (grade !== undefined) updates.grade = grade;
    if (subjects !== undefined) updates.subjects = subjects;

    const user = await userModel.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
/*
 * Request a password reset — generates a token, emails
 * a reset link. Always returns the same response whether
 * the email exists or not (prevents email enumeration).
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

      try {
        await sendResetPasswordEmail(user.email, resetUrl);
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
        // Dev fallback — log the link so you can test without email working
        console.log("Reset URL (dev):", resetUrl);
      }
    }

    return res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
 * Reset password using the token from the email link
 */
async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
/*
 * Change password for logged-in user — requires current
 * password for verification
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await userModel.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  
};