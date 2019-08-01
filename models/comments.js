const mongoose = require("mongoose");
const Notification = require("./notifications");
const Message = require("./message");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  {
    timestamps: true
  }
);

commentSchema.post('save', async function(next) {
  try {
    let message = await Message.findById(this.message);
    if(message.user !== this.user) {
      await Notification.create({
        recipient: message.user,
        sender: this.user,
        message: this.message,
        type: "comment"
      });
    }
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Comment", commentSchema);
