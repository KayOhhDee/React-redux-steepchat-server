const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    read: {
      type: Boolean,
      default: false
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
    type: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);