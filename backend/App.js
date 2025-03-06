// app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./db/db.connect");
const userRoutes = require("./routes/user.route");
dotenv.config();
const cors = require("cors");

const App = express();
const PORT = process.env.PORT || 8080;

// Middleware
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use("/uploads", express.static("uploads"));

// Database connection
connectDb();

// Routes with prefix
App.use("/api/users", userRoutes);

App.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
