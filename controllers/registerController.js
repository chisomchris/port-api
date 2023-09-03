const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
  // register new user
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      username,
      password: hashedPassword,
    });

    if (result) {
      return res.status(201).json({ success: `New user ${username} created` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = handleRegister;
