const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },

    // delete message
    deleted: { type: Boolean, default: false },
    deletedForEveryone: { type: Boolean, default: false },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true } // Enable automatic `createdAt` and `updatedAt` fields
);

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
