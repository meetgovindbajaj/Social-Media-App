const hashing = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const encryptPassword = asyncHandler(async (password) => {
  const salt = await hashing.genSalt(12);
  const hashedPass = await hashing.hash(password, salt);
  return hashedPass;
});
const comparePassword = asyncHandler(async (userPassword, encPassword) => {
  const isMatch = await hashing.compare(userPassword, encPassword);
  return isMatch;
});
module.exports = { encryptPassword, comparePassword };
