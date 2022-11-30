const mongoose = require("mongoose");
const postModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    head: {
      type: String,
      trim: true,
      default: "",
    },
    body: {
      type: String,
      trim: true,
      default: "",
    },
    pic: {
      required: true,
      type: String,
    },
    tags: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postModel);
module.exports = Post;
