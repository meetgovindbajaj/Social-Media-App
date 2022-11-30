const express = require("express");
const {
  getChats,
  accessChat,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chat_controller");
const protect = require("../middlewares/auth");
const router = express.Router();

// @chat --Get_Chats --Access_Chat
router.route("/").get(protect, getChats).post(protect, accessChat);

// @chat --Create_Group
router.route("/c_g").post(protect, createGroup);

// @chat --Rename_Group
router.route("/r_g").put(protect, renameGroup);

// @chat --Add_To_Group
router.route("/a_g").put(protect, addToGroup);

// @chat --Remove_From_Group
router.route("/d_g").put(protect, removeFromGroup);

module.exports = router;
