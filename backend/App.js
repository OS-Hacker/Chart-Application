const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./db/db.connect");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const cors = require("cors");
const path = require('path');
dotenv.config();

const { App, server } = require("./SocketIo/server");

const PORT = process.env.PORT || 4002; // Change the port number here

// Middleware
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use("/uploads", express.static("uploads"));


// Database connection
connectDb();

// Routes with prefix
App.use("/api/users", userRoutes);
App.use("/api/message", messageRoutes);

// ---- code for deployment -----
const dirPath= path.resolve();
if(process.env.NODE_ENV === "production"){
   App.use(express.static(path.join(dirPath,"../frontend/dist")));

   App.get("*",()=>{
    res.sendFile(path.join(dirPath,"../frontend","dist","index.html"))
   })
}

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
