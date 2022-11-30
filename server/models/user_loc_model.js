const mongoose = require("mongoose");
const userLocModel = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      unique: true,
    },
    city: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "City",
    },
    state: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "State",
    },
    country: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Country",
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserLoc = mongoose.model("UserLoc", userLocModel);
module.exports = UserLoc;
