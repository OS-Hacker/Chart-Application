const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./db/db.connect");
const userRoutes = require("./routes/user.route");
dotenv.config(); // config dotenv

const App = express();
const PORT = process.env.PORT;

// db connection
connectDb();

// routes
App.use("api/v1", userRoutes);

App.listen(PORT, () => console.log(`server is running on ${PORT}`));
