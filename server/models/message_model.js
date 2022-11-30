const mongoose = require("mongoose");
const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chat",
    },
    content: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
