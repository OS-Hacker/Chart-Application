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
      required: true,
    },
    confirm_pass: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
