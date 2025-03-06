const express = require("express");
const {
  SingupUserController,
  LoginUserController,
  UserProfileController,
  LogoutUserController,
  UserSearchController,
} = require("../controllers/user.controller");
const { upload } = require("../helper/helpers");
const { authUser } = require("../middleware/auth.middleware");

const userRoutes = express.Router();

userRoutes.post(
  "/singup-user",
  upload.single("profileImage"),
  SingupUserController
);

userRoutes.post("/login-user", LoginUserController);

userRoutes.get("/profile", authUser, UserProfileController);

userRoutes.get("/search-user", authUser, UserSearchController);

userRoutes.get("/logout", authUser, LogoutUserController);

module.exports = userRoutes;
