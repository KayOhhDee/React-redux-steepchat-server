const mongoose = require("mongoose");
const db = require("./index")

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

commentSchema.post('save', async function(doc, next) {
  try {
    let message = await db.Message.findById(this.message);
    if(message.user.toString() !== this.user.toString()) {
      await db.Notification.create({
        recipient: message.user,
        sender: this.user,
        message: this.message,
        type: "comment"
      });
    }
  } catch (error) {
    return next(error)
  }
})

module.exports = mongoose.model("Comment", commentSchema);
