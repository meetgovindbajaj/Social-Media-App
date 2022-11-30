const express = require("express");
const {
  createPost,
  updatePost,
  getPosts,
  accessPost,
  accessPostComments,
  accessPostCommentReplies,
  likeUnlikePost,
  likeUnlikePostComment,
  likeUnlikePostCommentReply,
  replyPost,
  replyPostComment,
  removePost,
  getPostCommentsCount,
  getPostCommentRepliesCount,
} = require("../controllers/post_controller");
const protect = require("../middlewares/auth");
const router = express.Router();

// @post --Create_Post
router.route("/c_p").post(protect, createPost);

// @post --Update_Post
router.route("/u_p").put(protect, updatePost);

// @post --Get_Posts
router.route("/").get(protect, getPosts);

// @post --Get_Single_Post
router.route("/p_s").get(protect, accessPost);

// @post --Get_Post_Comments_Count
router.route("/p_c_c").get(protect, getPostCommentsCount);

// @post --Get_Post_Comments
router.route("/p_c").get(protect, accessPostComments);

// @post --Get_Post_Comments_Count
router.route("/p_c_r_c").get(protect, getPostCommentRepliesCount);

// @post --Get_Post_Comment_Replies
router.route("/p_c_r").get(protect, accessPostCommentReplies);

// @post --Like_Unlike_Post
router.route("/lu_p").put(protect, likeUnlikePost);

// @post --Like_Unlike_Post_Comment
router.route("/lu_p_c").put(protect, likeUnlikePostComment);

// @post --Like_Unlike_Post_Comment_Reply
router.route("/lu_p_c_r").put(protect, likeUnlikePostCommentReply);

// @post --Reply_Post
router.route("/r_p").put(protect, replyPost);

// @post --Reply_Post_Comment
router.route("/r_p_c").put(protect, replyPostComment);

// @post --Remove_Post
router.route("/d_p").delete(protect, removePost);

module.exports = router;
