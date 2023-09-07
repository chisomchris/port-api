const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/email");
const {
  generateAccess,
  generateRefresh,
  generateOTP,
} = require("../utils/jwtToken");
const { generateOtp } = require("../utils/generateOtp");
const { OTP_ACTIONS } = require("../utils/config");

const handleRegister = async (req, res) => {
  try {
    // register new user
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    // check for duplicate
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpToken = generateOTP({ otp, action: OTP_ACTIONS.NewUser });
    const result = await User.create({
      email,
      password: hashedPassword,
      otpToken,
    });

    if (result) {
      // send email
      const data = {
        from: "Chisom",
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      };
      await sendEmail(data);
      return res.status(201).json({ success: `New user ${email} created` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const verifyNewUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "email and otp are required." });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.status(404).json({ message: "User not found" });
    if (foundUser.verificationStatus)
      return res.status(400).json({ message: "User already verified" });

    jwt.verify(
      foundUser.otpToken,
      process.env.OTP_SECRET,
      async (err, decoded) => {
        if (
          err ||
          otp !== decoded.otp ||
          decoded.action !== OTP_ACTIONS.NewUser
        ) {
          return res.sendStatus(403);
        }
        const roles = Object.values(foundUser?.roles).filter((role) => !!role);
        const accessToken = generateAccess({
          UserInfo: {
            email: foundUser.email,
            roles,
          },
        });
        const refreshToken = generateRefresh({ email: foundUser.email });
        foundUser.verificationStatus = true;
        foundUser.refreshToken = refreshToken;
        foundUser.otpToken = "";
        await foundUser.save();
        return res
          .status(200)
          .json({ email: foundUser.email, accessToken, refreshToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyNewUser, handleRegister };
