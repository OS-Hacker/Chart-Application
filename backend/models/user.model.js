const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
    },
    confirm_pass: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
