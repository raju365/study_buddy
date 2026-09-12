/*
 * -------------------------------------------------------
 * File : server.js
 * Description : Entry point — starts HTTP server + sockets
 * Author : Raju Barman
 * -------------------------------------------------------
 */

require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");
// const initSocket = require("./src/sockets/socket.server");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// initSocket(server); // will wire this up when we build rooms

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();