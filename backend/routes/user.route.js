const express = require("express");
const {
  SignupUserController,
  LoginUserController,
  LogoutUserController,
  UserSearchController,
  GetAllUserController,
  ProtectUserController,
  EditUserProfileController,
  EditUserNameController,
} = require("../controllers/user.controller");
const authUser = require("../middleware/auth.middleware");
const { upload } = require("../helper/helpers");

const userRoutes = express.Router();

userRoutes.post("/signup", upload.single("profileImage"), SignupUserController);

userRoutes.post("/login", LoginUserController);

userRoutes.get("/getUsers", authUser, GetAllUserController);

userRoutes.get("/search", authUser, UserSearchController);

userRoutes.post("/logout", authUser, LogoutUserController);

userRoutes.put(
  "/upload-image/:id",
  authUser,
  upload.single("profileImage"),
  EditUserProfileController
);

userRoutes.put("/", authUser, EditUserNameController);

// protect user
userRoutes.get("/user-protect", authUser, ProtectUserController);

module.exports = userRoutes;
