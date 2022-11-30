const mongoose = require("mongoose");
const cityModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iso2: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "State",
  },
});

const City = mongoose.model("City", cityModel);
module.exports = City;
