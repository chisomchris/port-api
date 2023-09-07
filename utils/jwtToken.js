require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccess = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60s" });
const generateRefresh = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
const generateOTP = (payload) =>
  jwt.sign(payload, process.env.OTP_SECRET, { expiresIn: "900s" });

module.exports = { generateAccess, generateRefresh, generateOTP };
