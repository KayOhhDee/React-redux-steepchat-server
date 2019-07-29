const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
});

module.exports = mongoose.model("Likes", likesSchema);