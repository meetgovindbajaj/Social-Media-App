const mongoose = require("mongoose");
const postComRepModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    com: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "PostCom",
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

const PostComRep = mongoose.model("PostComRep", postComRepModel);
module.exports = PostComRep;
