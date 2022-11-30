const express = require("express");
const {
  getCountry,
  getState,
  getCity,
} = require("../controllers/misc_controller");
const router = express.Router();

// @misc --Get_Countries
router.route("/country").get(getCountry);

// @misc --Get_States
router.route("/state").get(getState);

// @misc --Get_Cities
router.route("/city").get(getCity);

module.exports = router;
