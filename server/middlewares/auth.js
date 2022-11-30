const asyncHandler = require("express-async-handler");
const User = require("../models/user_model");
const genRes = require("../utils/generateResponse");
const { verifyToken } = require("../utils/tokenHandler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    const decoded = verifyToken(token);
    const rootUser = await User.findById(decoded.id).select("-password");
    if (!rootUser) {
      return res.status(404).json(genRes(404, true, "Not Found"));
    }
    req.user = rootUser;
    req.id = rootUser.id;
    next();
  } catch (err) {
    return res.status(500).json(genRes(500, true, err));
  }
});

module.exports = protect;
