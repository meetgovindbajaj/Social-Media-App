const mongoose = require("mongoose");
const postComModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
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

const PostCom = mongoose.model("PostCom", postComModel);
module.exports = PostCom;
