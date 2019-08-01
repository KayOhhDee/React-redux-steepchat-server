const mongoose = require("mongoose");
const Notification = require("./notifications");
const Message = require("./message");
const User = require("./user");

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

likesSchema.post('save', async function(next) {
  try {
    let message = await Message.findById(this.message)
    await Notification.create({
      recipient: message.user,
      sender: this.user,
      message: this.message,
      type: "like"
    })
  } catch (error) {
    next(error)
  }
})

likesSchema.pre('remove', async function(next) {
  try {
    let user = await User.findById(this.user);
    let notification = await Notification.find({
      sender: this.user,
      message: this.message,
      type: "like"
    })
    notification[0].remove();

    user.likes.remove(this.id);
    await user.save();
    
    return next();
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Likes", likesSchema);