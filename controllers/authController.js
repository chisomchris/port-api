const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccess,
  generateRefresh,
  generateOTP,
} = require("../utils/jwtToken");
const { generateOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/email");
const { OTP_ACTIONS } = require("../utils/config");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required." });
    }
    // find user
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.sendStatus(401);
    }
    if (!foundUser.verificationStatus) {
      return res.status(401).json({ message: "unverified user" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser?.roles).filter((role) => !!role);
      const accessToken = generateAccess({
        UserInfo: {
          email: foundUser.email,
          roles,
        },
      });
      const refreshToken = generateRefresh({ email: foundUser.email });

      foundUser.refreshToken = refreshToken;

      await foundUser.save();

      res
        .status(200)
        .json({ email: foundUser.email, accessToken, refreshToken });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleLogout = async (req, res) => {
  const { refreshToken } = req.body;
  //   find user who has the refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();
  // delete refresh token in DB
  foundUser.refreshToken = "";
  await foundUser.save();
  return res.sendStatus(204);
};

const resendOtp = async (req, res) => {
  try {
    const { email, action } = req.body;
    if (!email || !action) {
      return res
        .status(400)
        .json({ message: "email and action type are required." });
    }

    if (!Object.values(OTP_ACTIONS).includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const otp = generateOtp();
    const otpToken = generateOTP({ otp, action });
    foundUser.otpToken = otpToken;
    await foundUser.save();

    // send email
    const data = {
      from: "christianchisom278@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `your OTP is ${otp}`,
    };
    await sendEmail(data);

    res.status(200).json({ success: `email sent to ${email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(404).json({ message: `User with ${email} not found` });
    }
    const otp = generateOtp();
    const otpToken = generateOTP({ otp, action: OTP_ACTIONS.PasswordChange });
    foundUser.otpToken = otpToken;
    await foundUser.save();

    // send email
    const data = {
      from: "christianchisom278@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `your OTP is ${otp}`,
    };
    await sendEmail(data);
    res.status(200).json({ success: `email sent to ${email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.body.email && req.body.oldPassword && req.body.newPassword) {
      const { email, oldPassword, newPassword } = req.body;
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
      const token = authHeader.split(" ")[1];

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
          if (err ) {
            return res.sendStatus(403);
          }
          // find user
          const foundUser = await User.findOne({ email }).exec();
          if (!foundUser) {
            return res.sendStatus(404);
          }
          const match = await bcrypt.compare(oldPassword, foundUser.password);
          if (match) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            foundUser.password = hashedPassword;
            foundUser.otpToken = "";
            const result = await foundUser.save();
            if (result) {
              return res
                .status(201)
                .json({ success: `password updated successfully` });
            }
          } else {
            res.sendStatus(401);
          }
        }
      );
      
    } else if (req.body.email && req.body.password && req.body.otp) {
      const { email, password, otp } = req.body;
      const foundUser = await User.findOne({ email }).exec();
      if (!foundUser) {
        return res
          .status(404)
          .json({ message: `User with ${email} not found` });
      }
      // verify otp
      jwt.verify(
        foundUser.otpToken,
        process.env.OTP_SECRET,
        async (err, decoded) => {
          if (
            err ||
            otp !== decoded.otp ||
            decoded.action !== OTP_ACTIONS.PasswordChange
          ) {
            return res.sendStatus(403);
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          foundUser.password = hashedPassword;
          foundUser.otpToken = "";

          const result = await foundUser.save();
          if (result) {
            // send email
            const data = {
              from: "christianchisom278@gmail.com",
              to: email,
              subject: "Password Change",
              text: `your password was changed successfully`,
            };
            await sendEmail(data);
            return res
              .status(201)
              .json({ success: `password updated successfully` });
          }
        }
      );
    } else {
      res.status(400).json({ message: "Invalid feilds" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleLogin,
  resetPassword,
  forgotPassword,
  resendOtp,
  handleLogout,
};
