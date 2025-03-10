const Conversation = require("../models/Conversation.model");
const { getReceiverSocketId, io } = require("./../SocketIo/server");
const messageModel = require("../models/Message.model");
const { ObjectId } = require("mongoose").Types;
const cloudinary = require("../lib/cloudinary")

async function SendMessageController(req, res) {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate receiverId as a valid ObjectId
    if (!ObjectId.isValid(receiverId)) {
      return res.status(400).send({ msg: "Invalid receiver ID" });
    }

    // Find or create a conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    let imageUrl;
    if (req.file) {
      try {
        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat-app", // Optional: Specify a folder in Cloudinary
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).send({ msg: "Failed to upload image" });
      }
    }

    // Create a new message
    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
      image: imageUrl,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save both conversation and message concurrently
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit the new message to the receiver if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).send({ msg: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error in SendMessageController:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
}

const GetMessageController = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    // Validate chatUser as a valid ObjectId
    if (!ObjectId.isValid(chatUser)) {
      return res.status(400).send({ msg: "Invalid chat user ID" });
    }

    // Find the conversation and populate messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatUser] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } },
    });

    if (!conversation) {
      return res.status(200).send([]);
    }

    const messages = conversation.messages;
    res.status(200).send(messages);
  } catch (error) {
    console.error("Error in GetMessageController:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = {
  SendMessageController,
  GetMessageController,
};
