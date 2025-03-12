const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./db/db.connect");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
dotenv.config();

const { App, server } = require("./SocketIo/server");

// Middleware
// Enable CORS for all routes
App.use(cors());
App.use(helmet());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Database connection
connectDb();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

App.use(limiter);

// Routes
App.use("/api/users", userRoutes);
App.use("/api/message", messageRoutes);

// Deployment setup
// Serve static files from the frontend build directory
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../frontend/build"); // Adjust the path to your frontend build directory
  App.use(express.static(frontendBuildPath));

  // Handle client-side routing (e.g., React Router)
  App.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
