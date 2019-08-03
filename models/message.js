const mongoose = require('mongoose');
const db = require("./index");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

messageSchema.pre('remove', async function(next) {
  try {
    let user = await db.User.findById(this.user);
  
    await user.messages.remove(this.id);
    await user.save();

    await db.Notification.find({message: this.id}).deleteMany();
    await db.Likes.find({message: this.id}).deleteMany();
    await db.Comment.find({ message: this.id }).deleteMany();

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Message', messageSchema)