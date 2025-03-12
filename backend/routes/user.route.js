const express = require("express");
const {
  SignupUserController,
  LoginUserController, 
  LogoutUserController,
  UserSearchController,
  GetAllUserController,
  ProtectUserController,
} = require("../controllers/user.controller");
const { upload } = require("../helper/helpers");
const authUser = require("../middleware/auth.middleware");

const userRoutes = express.Router();

userRoutes.post("/signup", upload.single("profileImage"), SignupUserController);

userRoutes.post("/login", LoginUserController);

userRoutes.get("/getUsers", authUser, GetAllUserController);

userRoutes.get("/search", authUser, UserSearchController);

userRoutes.post("/logout", authUser, LogoutUserController);

// protect user
userRoutes.get("/user-protect", authUser, ProtectUserController);

module.exports = userRoutes;
