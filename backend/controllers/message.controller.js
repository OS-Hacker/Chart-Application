const Conversation = require("../models/Conversation.model");
const { getReceiverSocketId, io } = require("./../SocketIo/server");
const messageModel = require("../models/Message.model");
const { ObjectId } = require("mongoose").Types;
const cloudinary = require("../lib/cloudinary");

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
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
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

/**
 * Delete a message (for me or for everyone)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// Enhanced deleteMessage controller
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    const { deleteForEveryone } = req.body;

    if (!ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: "Invalid message ID" });
    }

    const message = await messageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      participants: userId,
      messages: messageId
    });
    
    if (!conversation) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }

    const isSender = message.senderId.toString() === userId.toString();

    if (deleteForEveryone && !isSender) {
      return res.status(403).json({ 
        error: "Only the sender can delete for everyone" 
      });
    }

    // Different update operations based on deletion type
    const updateOperation = deleteForEveryone
      ? {
          $set: {
            message: "This message was deleted",
            image: null,
            deletedForEveryone: true,
            deletedAt: new Date()
          }
        }
      : {
          $addToSet: { deletedFor: userId }
        };

    const updatedMessage = await messageModel.findByIdAndUpdate(
      messageId,
      updateOperation,
      { new: true }
    );

    // Notify via socket
    const receiverId = isSender ? message.receiverId : message.senderId;
    const socketId = getReceiverSocketId(receiverId);
    
    if (socketId) {
      io.to(socketId).emit("messageDeleted", {
        messageId,
        deleteForEveryone,
        conversationId: conversation._id
      });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Helper function to notify conversation participants
 * @param {Object} message - The message object
 * @param {Boolean} forEveryone - Whether it was deleted for everyone
 */

const notifyParticipants = async (message, forEveryone) => {
  try {
    // Find the conversation
    const conversation = await Conversation.findOne({
      messages: message._id,
    }).populate("participants");

    if (!conversation) return;

    // Determine who to notify
    const participantsToNotify = conversation.participants.filter(
      (participant) =>
        participant._id.toString() !== message.senderId.toString()
    );

    // Emit socket events
    participantsToNotify.forEach((participant) => {
      const socketId = getReceiverSocketId(participant._id);
      if (socketId) {
        io.to(socketId).emit(
          forEveryone ? "messageDeletedForEveryone" : "messageDeletedForMe",
          {
            messageId: message._id,
            deletedForEveryone: forEveryone,
            updatedMessage: message,
          }
        );
      }
    });
  } catch (error) {
    console.error("Error notifying participants:", error);
  }
};

module.exports = {
  SendMessageController,
  GetMessageController,
  deleteMessage,
};
