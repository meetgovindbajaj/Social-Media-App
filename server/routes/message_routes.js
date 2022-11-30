const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/message_controller");
const protect = require("../middlewares/auth");
const router = express.Router();

// @message --Send_Message
router.route("/").post(protect, sendMessage);

// @message --Get_All_Messages
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
