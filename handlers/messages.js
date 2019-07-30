const db = require('../models');

exports.createMessage = async function(req, res, next) {
  try {
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    let foundUser = await db.User.findById(req.params.id);
    foundUser.messages.push(message.id);
    await foundUser.save();
    let foundMessage = await db.Message.findById(message._id).populate('user', {
      username: true,
      profileImage: true
    });
    return res.status(200).json(foundMessage);
  } catch (err) {
    next(err)
  }
}

exports.getMessage = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id)
      .populate({
        path: "comments",
        populate: { path: "user", select: "profileImage username" },
        options: {sort: { createdAt: 'desc'}}
      })
      .populate({
        path: "user",
        select: "profileImage username"
      })
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
}

exports.deleteMessage = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    return res.status(200).json(foundMessage);
  } catch (err) {
    
  }
}

exports.postComment = async function (req, res, next) {
  try {
    if(req.body.text.trim() === '') return res.status(400).json({error:{message:"Field must not be empty"}})

    let comment = await db.Comment.create({
      text: req.body.text,
      user: req.params.id,
      message: req.params.message_id
    })
    let message = await db.Message.findById(req.params.message_id);
    message.comments.push(comment.id);
    await message.save();

    let foundComment = await db.Comment.findById(comment._id)
     .populate('user', {
        username: true,
        profileImage: true
      })
    return res.status(200).json(foundComment);
  } catch (error) {
    next(error)
  }
}

