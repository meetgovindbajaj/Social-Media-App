const mongoose = require("mongoose");
const stateModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iso2: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Country",
  },
});

const State = mongoose.model("State", stateModel);
module.exports = State;
