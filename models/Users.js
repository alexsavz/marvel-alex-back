const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  avatar: {
    type: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;