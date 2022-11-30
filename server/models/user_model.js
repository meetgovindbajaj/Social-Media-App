const mongoose = require("mongoose");
const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      immutable: true,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    tag: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    coverPic: {
      type: String,
      required: true,
      default:
        "https://drive.google.com/file/d/1h-JrfIWMepHM1o0FHTsfgpWxkGY_Xohp/view?usp=sharing",
    },
    bio: {
      type: String,
      trim: true,
    },
    following: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    loginMode: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userModel);
module.exports = User;
