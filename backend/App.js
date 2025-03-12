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
App.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
    },
  })
);

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
const dirPath = path.resolve();
if (process.env.NODE_ENV === "production") {
  App.use(express.static(path.join(dirPath, "../frontend/dist")));

  App.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "../frontend", "dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
