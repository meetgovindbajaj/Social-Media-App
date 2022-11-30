const asyncHandler = require("express-async-handler");
const genRes = require("../utils/generateResponse");
const Chat = require("../models/chat_model");
const User = require("../models/user_model");
const Message = require("../models/message_model");

// @message --sendMessage : send message in group or single chat
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    const newMessage = {
      sender: req.id,
      content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name tag pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name tag pic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.status(200).json(genRes(200, false, "Success", message));
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: message_controller.js : sendMessage : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @message --allMessages : get all messages of single chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email tag")
      .populate("chat");
    return res.status(200).json(genRes(200, false, "Success", messages));
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: message_controller.js : allMessages : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

module.exports = { sendMessage, allMessages };
