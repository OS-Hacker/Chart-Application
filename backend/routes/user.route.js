const express = require("express");
const { SingupUserController } = require("../controllers/user.controller");

const userRoutes = express.Router();

userRoutes.post("/singup-user", SingupUserController);

module.exports = userRoutes;
