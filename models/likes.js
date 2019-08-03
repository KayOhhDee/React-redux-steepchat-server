const mongoose = require("mongoose");
const db = require("./index");

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

likesSchema.post('save', async function(doc, next) {
  try {
    let message = await db.Message.findById(this.message)
    if(message.user.toString() !== this.user.toString()) {
      await db.Notification.create({
        recipient: message.user,
        sender: this.user,
        message: this.message,
        type: "like"
      });
    }
  } catch (error) {
    next(error)
  }
})

likesSchema.pre('remove', async function(next) {
  try {
    let message = await db.Message.findById(this.message);
    let user = await db.User.findById(this.user);

    if(message.user.toString() !== this.user.toString()) {
      let notification = await db.Notification.find({
        sender: this.user,
        message: this.message,
        type: "like"
      })
      await notification[0].remove();
    }

    await user.likes.remove(this.id);
    await user.save();
    return next();
  } catch (error) {
    return next(error)
  }
})

module.exports = mongoose.model("Likes", likesSchema);