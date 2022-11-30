const express = require("express");
const {
  register,
  login,
  authenticate,
  logout,
  tagChecker,
  emailChecker,
} = require("../controllers/auth_controller");
const {
  searchUsers,
  searchAll,
  searchAllAnonymous,
  updateUser,
  updateUserPassword,
  deleteUser,
  followUnfolowUser,
  accessUser,
  accessUserAnonymous,
  accessAnotherUser,
  accessUserAddress,
  createOrUpdateUserAddress,
} = require("../controllers/user_controller");
const protect = require("../middlewares/auth");
const router = express.Router();

// @user --Register_User
router.route("/r").post(register);

// @user --Authenticate_User --Login_User
router.route("/l").get(protect, authenticate).post(login);

// @user --Logout_User
router.route("/l_o").get(logout);

// @user --Tag_Checker
router.route("/t_c").get(tagChecker);

// @user --Email_Checker
router.route("/e_c").get(emailChecker);

// @user --Search_User
router.route("/s").get(protect, searchUsers);

// @user --Search_All
router.route("/s_a").get(protect, searchAll);

// @user --Search_All_Anonymous
router.route("/s_aa").get(searchAllAnonymous);

// @user --Update_User
router.route("/u").put(protect, updateUser);

// @user --Update_User_Password
router.route("/u_p").put(protect, updateUserPassword);

// @user --Delete_User
router.route("/d").delete(protect, deleteUser);

// @user --Follow_Unfollow_Other_User
router.route("/fu").put(protect, followUnfolowUser);

// @user --Get_User
router.route("/g").get(protect, accessUser);

// @user --Get_User_Anonymous
router.route("/g_a").get(accessUserAnonymous);

// @user --Get_Another_User
router.route("/g_u").get(protect, accessAnotherUser);

// @user --Get_User_Address
router.route("/a").get(protect, accessUserAddress);

// @user --Create_Or_Update_User_Address
router.route("/a_cu").post(protect, createOrUpdateUserAddress);

module.exports = router;
