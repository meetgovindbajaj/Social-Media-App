const asyncHandler = require("express-async-handler");
const genRes = require("../utils/generateResponse");
const Chat = require("../models/chat_model");
const User = require("../models/user_model");

// @chat --getChats : get all the chats of user
const getChats = asyncHandler(async (req, res) => {
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name email pic tag",
    });
    return res.status(200).json(genRes(200, false, "Success", allChats));
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : getChats : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @chat --accessChat : create or fetch one on one chat
const accessChat = asyncHandler(async (req, res) => {
  try {
    let { userId } = req.body;
    if (!userId) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    let isChat = await Chat.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: req.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email pic tag",
    });
    if (isChat.length > 0) {
      return res.status(200).json(genRes(200, false, "Success", isChat[0]));
    } else {
      let newChat = {
        chatName: "sender",
        isGroup: false,
        users: [req.id, userId],
      };
      try {
        let createdChat = await Chat.create(newChat);
        let FullChat = await Chat.findById(createdChat._id).populate(
          "users",
          "-password"
        );
        return res.status(200).json(genRes(200, false, "Success", FullChat));
      } catch (error) {
        res.status(200).json(genRes(500, true, error));
      }
    }
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : accessChat : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @chat --createGroup : create new group chat
const createGroup = asyncHandler(async (req, res) => {
  try {
    let { chatName, usersString } = req.body;
    if (!chatName || !usersString) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    let users = JSON.parse(usersString);
    if (users.length < 2) {
      return res
        .status(400)
        .json(genRes(400, true, "More than 2 users required"));
    }
    users.push(req.user);
    try {
      let groupChat = await Chat.create({
        chatName,
        users,
        isGroup: true,
        groupAdmin: req.user,
      });
      let fullGroupChat = await Chat.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      return res.status(200).json(genRes(200, false, "Success", fullGroupChat));
    } catch (error) {}
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : createGroup : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @chat --renameGroup : rename group chat
const renameGroup = asyncHandler(async (req, res) => {
  try {
    let { chatId, chatName } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.status(404).json(genRes(404, true, "Chat Not Found"));
    } else {
      return res.status(200).json(genRes(200, false, "Success", updatedChat));
    }
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : renameGroup : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @chat --addToGroup : add someone to group chat
const addToGroup = asyncHandler(async (req, res) => {
  try {
    let { chatId, userId } = req.body;
    let added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      return res.status(404).json(genRes(404, true, "Chat Not Found"));
    } else {
      return res.status(200).json(genRes(200, false, "Success", added));
    }
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : addToGroup : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @chat --removeFromGroup : remove someone from group chat or delete group chat
const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    let { chatId, userId } = req.body;
    let removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      return res.status(404).json(genRes(404, true, "Chat Not Found"));
    } else {
      return res.status(200).json(genRes(200, false, "Success", removed));
    }
  } catch (error) {
    console.log(` -----------------------------------------------------------`);
    console.log(`file: chat_controller.js : removeFromGroup : error`, error);
    console.log(` -----------------------------------------------------------`);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

module.exports = {
  getChats,
  accessChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
