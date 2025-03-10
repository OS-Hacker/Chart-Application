const express = require("express");
const authUser = require("../middleware/auth.middleware");
const {
  SendMessageController,
  GetMessageController,
} = require("../controllers/message.controller");
const { upload } = require("../helper/helpers");

const messageRoutes = express.Router();

messageRoutes.post(
  "/send/:id",
  authUser,
  upload.single("image"),
  SendMessageController
);

messageRoutes.get("/get/:id", authUser, GetMessageController);

module.exports = messageRoutes;
