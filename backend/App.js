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

const PORT = process.env.PORT || 4002;

// Middleware
App.use(cors());
App.use(helmet());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use("/uploads", express.static("uploads"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
App.use(limiter);

// Database connection
connectDb();

// Routes
App.use("/api/users", userRoutes);
App.use("/api/message", messageRoutes);

// Deployment setup
const dirPath = path.resolve();
if (process.env.NODE_ENV === "production") {
  App.use(express.static(path.join(dirPath, "../frontend/dist")));

  App.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "../frontend", "index.html"));
  });
}

// Error handling
App.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

App.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
