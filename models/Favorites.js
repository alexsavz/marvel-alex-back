const mongoose = require("mongoose");

// MODEL INITIALISATION
const Favorite = mongoose.model("Favorite", {
    id: {
        type: String,
    },
    type: {
      type: String,
    },
    title: {
        type: String,
      },
    description: {
      type: String,
    },
    url : {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  });

  module.exports = Favorite;