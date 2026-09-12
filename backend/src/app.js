/*
 * -------------------------------------------------------
 * File : app.js
 * Description : Express app configuration
 *               (middlewares, routes, error handling)
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Core middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/*
 * Health check route
 */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Study Buddy API is running" });
});

// Routes will be mounted here as we build them
app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/doubts", require("./routes/doubt.routes"));
// app.use("/api/rooms", require("./routes/room.routes"));

/*
 * 404 handler — no matching route found
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;