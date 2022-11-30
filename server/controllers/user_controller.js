const asyncHandler = require("express-async-handler");
const Post = require("../models/post_model");
const User = require("../models/user_model");
const UserLoc = require("../models/user_loc_model");
const genRes = require("../utils/generateResponse");
const {
  comparePassword,
  encryptPassword,
} = require("../utils/passwordHandler");

// @user --searchUsers : search user inside chat
const searchUsers = asyncHandler(async (req, res) => {
  try {
    const s_q = req.query.search;
    const key = s_q
      ? {
          $or: [
            { name: { $regex: s_q, $options: "i" } },
            { email: { $regex: s_q, $options: "i" } },
            { tag: { $regex: s_q, $options: "i" } },
          ],
        }
      : {};
    let users = await User.find(key)
      .find({ _id: { $ne: req.id } })
      .limit(10);
    return res.status(200).json(genRes(200, false, "Success", users));
  } catch (error) {
    res.status(200).json(genRes(500, true, error));
  }
});

// @user --searchAll : search all users and posts
const searchAll = asyncHandler(async (req, res) => {
  try {
    const s_q = req.query.search;
    const userKey = s_q
      ? {
          $or: [
            { name: { $regex: s_q, $options: "i" } },
            { email: { $regex: s_q, $options: "i" } },
            { tag: { $regex: s_q, $options: "i" } },
          ],
        }
      : {};
    const postKey = s_q
      ? {
          $or: [
            { head: { $regex: s_q, $options: "i" } },
            { body: { $regex: s_q, $options: "i" } },
          ],
        }
      : {};
    let users = await User.find(userKey, {
      _id: 1,
      name: 1,
      email: 1,
      tag: 1,
      pic: 1,
    }).find({
      _id: { $ne: req.id },
    });
    let posts = await Post.find(postKey).find({
      sender: { $ne: req.id },
    });
    const results = { accounts: users, posts };
    return res.status(200).json(genRes(200, false, "Success", results));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --searchAllAnonymous : search all users and posts anonymously
const searchAllAnonymous = asyncHandler(async (req, res) => {
  try {
    const s_q = req.query.search;
    const userKey = s_q
      ? {
          $or: [
            { name: { $regex: s_q, $options: "i" } },
            { email: { $regex: s_q, $options: "i" } },
            { tag: { $regex: s_q, $options: "i" } },
          ],
        }
      : {};
    const postKey = s_q
      ? {
          $or: [
            { head: { $regex: s_q, $options: "i" } },
            { body: { $regex: s_q, $options: "i" } },
          ],
        }
      : {};
    let users = await User.find(userKey, {
      _id: 1,
      name: 1,
      email: 1,
      tag: 1,
      pic: 1,
    });
    let posts = await Post.find(postKey);
    const results = { accounts: users, posts };
    return res.status(200).json(genRes(200, false, "Success", results));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --updateUser : update user
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { updateData } = req.body;
    if (!updateData || updateData.password) {
      res.status(200).json(genRes(400, true, "Missing Docs!"));
    }
    const updatedUser = await User.findByIdAndUpdate(
      res.id,
      {
        $set: updateData,
      },
      { new: true }
    );
    return res.status(200).json(genRes(200, false, "Success", updatedUser));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --updateUserPassword : update user password
const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    const user = await User.findById(req.id);
    if (comparePassword(oldPassword, user.password)) {
      const encPassword = await encryptPassword(newPassword);
      await User.findByIdAndUpdate(req.id, { password: encPassword });
      return res.status(200).json(genRes());
    } else {
      res.status(200).json(genRes(400, true, "Bad Request"));
    }
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --deleteUser : delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.id);
    res.clearCookie("authToken");
    return res.status(200).json(genRes());
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --followUnfolowUser : follow or unfollow user
const followUnfolowUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId;
    const { follow } = req.body;
    if (!userId) {
      res.status(200).json(genRes(400, true, "Missing Queries!"));
    }
    let otherUser, user;
    if (follow) {
      otherUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            followers: req.id,
          },
        },
        {
          new: true,
        }
      ).select("-password,-loginMode");
      user = await User.findByIdAndUpdate(
        req.id,
        {
          $addToSet: {
            following: userId,
          },
        },
        { new: true, password: 0 }
      ).select("-password");
    } else {
      otherUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            followers: req.id,
          },
        },
        {
          new: true,
        }
      ).select("-password,-loginMode");
      user = await User.findByIdAndUpdate(
        req.id,
        {
          $pull: {
            following: userId,
          },
        },
        { new: true }
      ).select("-password");
    }
    return res
      .status(200)
      .json(genRes(200, false, "Success", { otherUser, user }));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --accessUser : get current user
const accessUser = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(genRes(200, false, "Success", req.user));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --accessUserAnonymous : get other user anonymously
const accessUserAnonymous = asyncHandler(async (req, res) => {
  try {
    const s_q = req.query.user;
    const user = await User.findOne({ tag: s_q }).select(
      "-password,-email,-bio,-following,-followers,-loginMode"
    );
    if (user) {
      return res.status(200).json(genRes(200, false, "Success", user));
    }
    return res.status(404).json(genRes(404, true, "User Not Found!"));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --accessAnotherUser : get other user
const accessAnotherUser = asyncHandler(async (req, res) => {
  try {
    const s_q = req.query.user;
    const user = await User.findOne({ tag: s_q }).select(
      "-password,-loginMode"
    );
    if (user) {
      return res.status(200).json(genRes(200, false, "Success", user));
    }
    return res.status(404).json(genRes(404, true, "User Not Found!"));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --accessUserAddress : get user location
const accessUserAddress = asyncHandler(async (req, res) => {
  try {
    let userLoc = await UserLoc.findOne({ user: req.id })
      .populate("user")
      .populate("country")
      .populate("state")
      .populate("city");
    if (userLoc) {
      res.status(200).json(genRes(200, false, "Success", userLoc));
    }
    res.status(404).json(genRes(404, true, "No Address!"));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @user --createOrUpdateUserAddress : create or update user location
const createOrUpdateUserAddress = asyncHandler(async (req, res) => {
  try {
    const { countryId, stateId, cityId, address } = req.body;
    let userLoc = await UserLoc.updateOne(
      { user: req.id },
      {
        user: req.id,
        country: countryId,
        state: stateId,
        city: cityId,
        address,
      },
      { upsert: true }
    );
    if (userLoc) {
      res.status(200).json(genRes(200, false, "Success", userLoc));
    }
    res.status(404).json(genRes(404, true, "No Address!"));
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

module.exports = {
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
};
