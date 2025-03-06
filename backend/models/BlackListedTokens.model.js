const mongoose = require("mongoose");

const blackListedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours in seconds
  },
});

const BlackListedTokenModel = mongoose.model(
  "BlackListedToken",
  blackListedTokenSchema
);

module.exports = BlackListedTokenModel;

// This schema defines a BlackListedToken model with a token field and a createdAt field. 
// The createdAt field has an expires option set to 86400 seconds (24 hours), 
// which means the document will be automatically removed from the collection after 24 hours.