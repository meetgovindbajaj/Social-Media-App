const mongoose = require("mongoose");
const countryModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iso2: {
    type: String,
    required: true,
    unique: true,
  },
});
//export
const Country = mongoose.model("Country", countryModel);
module.exports = Country;
