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
    next(err)
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

    await db.Message.findByIdAndUpdate(req.params.message_id, { $inc: { commentCount: 1 } })

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

exports.likeMessage = async function(req, res, next) {
  try {
    let likeDocument = await db.Likes.find({
      user: req.params.id, 
      message: req.params.message_id
    })

    if(likeDocument.length === 0) {
      await db.Likes.create({
        user: req.params.id,
        message: req.params.message_id
      })

      let foundMessage = await db.Message.findByIdAndUpdate(req.params.message_id, { $inc: { likeCount: 1 } })
      return res.status(200).json(foundMessage);
    } else {
      return res.status(400).json({error: {message: 'Post already liked'}})
    }
      
  } catch (error) {
    next(error)
  }
}

exports.unlikeMessage = async function(req, res, next) {
  try {
    let likeDocument = await db.Likes.find({
      user: req.params.id, 
      message: req.params.message_id
    })

    if(likeDocument.length === 0) {
      return res.status(400).json({error: {message: 'Post not liked'}})
    } else {
      let foundLike = await db.Likes.findById(likeDocument[0]._id);
      await foundLike.remove();

      let foundMessage = await db.Message.findByIdAndUpdate(req.params.message_id, { $inc: { likeCount: -1 } })
      return res.status(200).json(foundMessage);
    }
      
  } catch (error) {
    next(error)
  }
}

