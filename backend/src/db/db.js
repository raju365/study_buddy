/*
 * -------------------------------------------------------
 * File : db.js
 * Description : Handles MongoDB connection setup
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const mongoose = require("mongoose");

/*
 * Connect to MongoDB using MONGO_URI from environment
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);

    process.exit(1);
  }
}

module.exports = connectDB;