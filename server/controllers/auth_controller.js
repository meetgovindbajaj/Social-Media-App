const {
  encryptPassword,
  comparePassword,
} = require("../utils/passwordHandler");
const asyncHandler = require("express-async-handler");
const User = require("../models/user_model");
const slugify = require("slugify");
const { generateToken } = require("../utils/tokenHandler");
const genRes = require("../utils/generateResponse");
const Email_Checker = require("../utils/emailHandler");

// @auth --register : register new user
const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, tag, loginMode } = req.body;
    if (!name || !email || !password || !tag) {
      return res.status(200).json(genRes(400, true, "Missing Arguments!"));
    }
    if (
      !password.match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\*\.\!\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\?\/\~\_\+\-\=\|\\]).{8,32}$/
      )
    ) {
      return res.status(200).json(genRes(400, true, "Invalid Arguments!"));
    }
    const checker = await Email_Checker(email);
    if (!checker.valid) {
      return res.status(200).json(genRes(403, true, checker.message));
    }
    const userExists = await User.findOne({ $or: [{ email }, { tag }] });
    if (userExists) {
      return res.status(200).json(genRes(403, true, "User Already Exists!"));
    }
    const newUser = {
      name,
      email,
      password: await encryptPassword(password),
      tag: slugify(tag),
      loginMode,
    };
    const user = await User.create(newUser);
    if (user) {
      return res.status(200).json(genRes());
    } else {
      return res.status(408).json(genRes(408, true, "Request Timeout!"));
    }
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @auth --login : login user via credentials
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password, loginMode, otherInfo } = req.body;
    if (loginMode === 1) {
      if (!email || !password) {
        res.status(200).json(genRes(400, true, "Missing Arguments!"));
      }
      const user = await User.findOne({ email });
      const matchPassword = await comparePassword(
        password,
        user.password ?? ""
      );
      if (user && matchPassword) {
        const token = generateToken(user._id);
        res.cookie("authToken", token, {
          expires: new Date(Date.now() + 2.592e9),
          httpOnly: true,
        });
        return res.status(200).json(genRes(200, false, "Login Success", user));
      } else {
        return res.status(200).json(genRes(400, true, "Invalid Arguments"));
      }
    } else if (loginMode === 2) {
      const user = await User.findOne({ email: email });
      if (user) {
        const token = generateToken(user._id);
        res.cookie("authToken", token, {
          expires: new Date(Date.now() + 2.592e9),
          httpOnly: true,
        });
        return res.status(200).json(genRes(200, false, "Login Success", user));
      } else {
        const newUser = await User.create({
          name: otherInfo.name,
          email,
          tag: slugify(otherInfo.sub),
          pic: otherInfo.picture,
          loginMode,
        });
        if (newUser) {
          const token = generateToken(newUser._id);
          res.cookie("authToken", token, {
            expires: new Date(Date.now() + 2.592e9),
            httpOnly: true,
          });
          return res
            .status(200)
            .json(genRes(200, false, "Login Success", newUser));
        } else {
          return res.status(408).json(genRes(408, true, "Request Timeout!"));
        }
      }
    } else {
      return res.status(200).json(genRes(400, true, "Bad Request"));
    }
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @auth --authenticate : login user via auth token
const authenticate = asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json(genRes(200, false, "Success", req.user));
    } else {
      return res.status(200).json(genRes(400, true, "Bad Request"));
    }
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @auth --tagChecker : checks if the tag is available or not
const tagChecker = asyncHandler(async (req, res) => {
  try {
    const tag = req.query.tag;
    if (tag === null || tag === undefined) {
      return res.status(200).json(genRes(400, true, "Invalid Request"));
    }
    const user = await User.findOne({ tag });
    if (user) {
      return res.status(200).json(genRes(400, true, "Username not available"));
    } else {
      return res.status(200).json(genRes(200, false, "Username available"));
    }
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @auth --emailChecker : checks if the email is available or not
const emailChecker = asyncHandler(async (req, res) => {
  try {
    const email = req.query.email;
    if (email === null || email === undefined) {
      return res.status(200).json(genRes(400, true, "Invalid Request"));
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json(genRes(400, true, "Email not available"));
    } else {
      const checker = await Email_Checker(email);
      if (checker.valid) {
        return res.status(200).json(genRes(200, false, checker.message));
      } else {
        return res.status(200).json(genRes(400, true, checker.message));
      }
    }
  } catch (error) {
    return res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

// @auth --logout : logout user
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("authToken");
  return res.status(200).json(genRes());
});

module.exports = {
  login,
  register,
  authenticate,
  logout,
  tagChecker,
  emailChecker,
};
