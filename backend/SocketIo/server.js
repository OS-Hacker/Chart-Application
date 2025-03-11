const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const App = express();

const server = http.createServer(App);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Use environment variable for client URL
    methods: ["GET", "POST"],
  },
});

const users = {}; // Store user IDs and their socket IDs

// Function to get receiver's socket ID
const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Extract userId from the handshake query
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id; // Associate userId with socket ID
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Emit online users to all clients
  io.emit("getOnline", Object.keys(users));

  // Handle private messages
  socket.on("sendMessage", (message) => {
    try {
      const { receiverId, content } = message;

      // Get the receiver's socket ID
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        // Emit the message to the receiver
        io.to(receiverSocketId).emit("receiveMessage", message);
        console.log(`Message sent to ${receiverId}:`, content);
      } else {
        console.log(`Receiver ${receiverId} is offline.`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      delete users[userId]; // Remove user from the users object
      io.emit("getOnline", Object.keys(users)); // Update online users list
      console.log(`User ${userId} disconnected.`);
    }
  });
});

// Export the app, io, server, and getReceiverSocketId function
module.exports = {
  App,
  io,
  server,
  getReceiverSocketId,
};
