const Country = require("../models/country_model");
const State = require("../models/state_model");
const City = require("../models/city_model");
const asyncHandler = require("express-async-handler");
const genRes = require("../utils/generateResponse");

// @misc --getCountry : access all countries
const getCountry = asyncHandler(async (req, res) => {
  const countries = await Country.find({});
  return res.status(200).json(genRes(200, false, "Success", countries));
});

// @misc --getState : access all states
const getState = asyncHandler(async (req, res) => {
  const countryId = req.query.countryId;
  const states = await State.find({ country: countryId });
  return res.status(200).json(genRes(200, false, "Success", states));
});

// @misc --getCity : access all cities
const getCity = asyncHandler(async (req, res) => {
  const stateId = req.query.stateId;
  const cities = await City.find({ state: stateId });
  return res.status(200).json(genRes(200, false, "Success", cities));
});

module.exports = { getCountry, getState, getCity };
