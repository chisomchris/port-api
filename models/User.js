const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    user: {
      type: Number,
      default: 1111,
    },
    admin: Number,
    editor: Number,
  },
  refreshToken: String,
});

module.exports = model("User", UserSchema);
