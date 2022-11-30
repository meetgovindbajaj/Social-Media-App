const asyncHandler = require("express-async-handler");
const genRes = require("../utils/generateResponse");
const Post = require("../models/post_model");
const PostCom = require("../models/post_com_model");
const PostComRep = require("../models/post_com_rep_model");
const User = require("../models/user_model");
const { deleteImage } = require("../utils/gridFs");

// @post --createPost : create new post
const createPost = asyncHandler(async (req, res) => {
  const { head, body, pic, tags } = req.body;
  try {
    if (!pic) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    let newPost = await Post.create({
      sender: req.id,
      head,
      body,
      pic,
      tags,
    });
    newPost = await User.populate(newPost, {
      path: "sender",
      select: "name tag pic",
    });
    newPost = await User.populate(newPost, {
      path: "tags",
      select: "name tag pic",
    });
    return res.status(200).json(genRes(200, false, "Success", newPost));
  } catch (error) {
    deleteImage(pic);
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --updatePost : update post
const updatePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    const { head, body } = req.body;
    let updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          head,
          body,
        },
      },
      {
        new: true,
      }
    );
    updatedPost = await User.populate(updatedPost, {
      path: "sender",
      select: "name tag pic",
    });
    updatedPost = await User.populate(updatedPost, {
      path: "tags",
      select: "name tag pic",
    });
    return res.status(200).json(genRes(200, false, "Success", updatedPost));
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --getPosts : get all posts
const getPosts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.id);
    let allPosts = await Post.find({
      $or: [{ sender: req.id }, { sender: { $in: user.following } }],
    })
      .populate("sender", "name tag pic")
      .populate("tags", "name tag pic")
      .populate("likes", "name tag pic")
      .sort({ createdAt: -1 });
    return res.status(200).json(genRes(200, false, "Success", allPosts));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --accessPost : get single post
const accessPost = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    if (!postId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let post = await Post.findById(postId)
      .populate("sender", "name tag pic")
      .populate("tags", "name tag pic")
      .populate("likes", "name tag pic");
    return res.status(200).json(genRes(200, false, "Success", post));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --getPostCommentsCount : get number of comments in single post
const getPostCommentsCount = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    if (!postId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let com = await PostCom.find(
      {
        post: postId,
      },
      { _id: 1 }
    );
    return res.status(200).json(genRes(200, false, "Success", com.length));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --accessPostComments : get all comments of single post
const accessPostComments = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    if (!postId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let com = await PostCom.find({
      post: postId,
    })
      .populate("sender", "name tag pic")
      .populate("likes", "name tag pic")
      .sort({ createdAt: -1 });
    return res.status(200).json(genRes(200, false, "Success", com));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --getPostCommentRepliesCount : get number of replies in single comment
const getPostCommentRepliesCount = asyncHandler(async (req, res) => {
  try {
    const comId = req.query.comId;
    if (!comId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let rep = await PostComRep.find(
      {
        com: comId,
      },
      { _id: 1 }
    );
    return res.status(200).json(genRes(200, false, "Success", rep.length));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --accessPostCommentReplies : get all replies of single comment
const accessPostCommentReplies = asyncHandler(async (req, res) => {
  try {
    const comId = req.query.comId;
    if (!comId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let comReps = await PostComRep.find({
      com: comId,
    })
      .populate("sender", "name tag pic")
      .populate("likes", "name tag pic")
      .sort({ createdAt: -1 });
    return res.status(200).json(genRes(200, false, "Success", comReps));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --likeUnlikePost : like or unlike post
const likeUnlikePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    const liked = req.query.liked;
    let post = await Post.findById(postId);
    const length = post.likes.filter(
      (item) => item.valueOf() === req.id
    ).length;
    if (liked === "true" && length <= 0) {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic")
        .populate("tags", "name tag pic");
    } else if (liked === "false" && length > 0) {
      post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic")
        .populate("tags", "name tag pic");
    } else {
      post = await User.populate(post, {
        path: "sender",
        select: "name tag pic",
      });
      post = await User.populate(post, {
        path: "tags",
        select: "name tag pic",
      });
      post = await User.populate(post, {
        path: "likes",
        select: "name tag pic",
      });
    }
    return res.status(200).json(genRes(200, false, "Success", post));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --likeUnlikePostComment : like or unlike comment
const likeUnlikePostComment = asyncHandler(async (req, res) => {
  try {
    const comId = req.query.comId;
    const liked = req.query.liked;
    let com = await PostCom.findById(comId);
    const length = com.likes.filter((item) => item.valueOf() === req.id).length;
    if (liked === "true" && length <= 0) {
      com = await PostCom.findByIdAndUpdate(
        comId,
        {
          $push: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic");
    } else if (liked === "false" && length > 0) {
      com = await PostCom.findByIdAndUpdate(
        comId,
        {
          $pull: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic");
    } else {
      com = await User.populate(com, {
        path: "sender",
        select: "name tag pic",
      });
      com = await User.populate(com, {
        path: "likes",
        select: "name tag pic",
      });
    }
    return res.status(200).json(genRes(200, false, "Success", com));
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --likeUnlikePostCommentReply : like or unlike reply
const likeUnlikePostCommentReply = asyncHandler(async (req, res) => {
  try {
    const repId = req.query.repId;
    const liked = req.query.liked;
    let rep = await PostComRep.findById(repId);
    const length = rep.likes.filter((item) => item.valueOf() === req.id).length;
    if (liked === "true" && length <= 0) {
      rep = await PostComRep.findByIdAndUpdate(
        repId,
        {
          $push: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic");
    } else if (liked === "false" && length > 0) {
      rep = await PostComRep.findByIdAndUpdate(
        repId,
        {
          $pull: {
            likes: req.id,
          },
        },
        { new: true }
      )
        .populate("likes", "name tag pic")
        .populate("sender", "name tag pic");
    } else {
      rep = await User.populate(rep, {
        path: "sender",
        select: "name tag pic",
      });
      rep = await User.populate(rep, {
        path: "likes",
        select: "name tag pic",
      });
    }
    return res.status(200).json(genRes(200, false, "Success", rep));
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --replyPost : comment on a post
const replyPost = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    const { content } = req.body;
    if (!content) {
      res.status(200).json(genRes(400, true, "Missing Content!"));
    }
    if (!postId) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    let newCom = await PostCom.create({
      sender: req.id,
      post: postId,
      content,
    });
    newCom = await User.populate(newCom, {
      path: "sender",
      select: "name tag pic",
    });
    return res.status(200).json(genRes(200, false, "Success", newCom));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --replyPostComment : reply on a comment
const replyPostComment = asyncHandler(async (req, res) => {
  try {
    const comId = req.query.comId;
    const { content } = req.body;
    if (!content) {
      res.status(200).json(genRes(400, true, "Missing Content!"));
    }
    if (!comId) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    let newComRep = await PostComRep.create({
      sender: req.id,
      com: comId,
      content,
    });
    newComRep = await User.populate(newComRep, {
      path: "sender",
      select: "name tag pic",
    });
    return res.status(200).json(genRes(200, false, "Success", newComRep));
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @post --removePost : delete post
const removePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.query.postId;
    const img = req.query.img;
    if (!postId) {
      res.status(400).json(genRes(400, true, "Missing Queries!"));
    }
    const post = await Post.findById(postId).populate("sender", "_id");
    if (post.sender.id === req.id) {
      const com = await PostCom.find(
        {
          post: postId,
        },
        { id: 1 }
      );
      const rep = await PostComRep.find(
        {
          com: {
            $in: com,
          },
        },
        { id: 1 }
      );
      deleteImage(img);
      await Post.findByIdAndDelete(postId);
      await PostCom.deleteMany({
        _id: {
          $in: com,
        },
      });
      await PostComRep.deleteMany({
        _id: {
          $in: rep,
        },
      });
    }
    return res.status(200).json(genRes());
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

module.exports = {
  createPost,
  updatePost,
  getPosts,
  accessPost,
  getPostCommentsCount,
  accessPostComments,
  getPostCommentRepliesCount,
  accessPostCommentReplies,
  likeUnlikePost,
  likeUnlikePostComment,
  likeUnlikePostCommentReply,
  replyPost,
  replyPostComment,
  removePost,
};
