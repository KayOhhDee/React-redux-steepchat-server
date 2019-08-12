const db = require("../models");
const formidable = require("formidable");
const { verifyUserInfo } = require("../utils/validators");

exports.getUserInfo = async function(req, res, next) {
  try {
    let user = await db.User.findById(req.params.id);
    let notificationArr = await db.Notification.find({ recipient: user._id }, '_id');
    let likesArr = await db.Likes.find({ user: user._id }, '_id');
    let newNotificationIds = [];
    let newLikesIds = [];

    notificationArr.map(n => newNotificationIds.push(n._id.toString()));
    likesArr.map(l => newLikesIds.push(l._id.toString()));

    let unusedLikes = user.likes.filter(like => !newLikesIds.includes(like.toString()));
    let unusedNotifications = user.notifications.filter(
      notification => !newNotificationIds.includes(notification.toString())
    );

    await db.User.update(
      {},
      { $pull: { likes: { $in: unusedLikes }, notifications: { $in: unusedNotifications } } },
      { multi: true }
    );

    likesArr.map(like => {
      if (!user.likes.includes(like._id)) {
        user.likes.push(like._id);
      }
    });
    notificationArr.map(notification => {
      if (!user.notifications.includes(notification._id)) {
        user.notifications.push(notification._id);
      }
    });

    await user.save();

    let foundUser = await db.User.findById(req.params.id, '-password')
      .populate({ path: "likes" })
      .populate({
        path: "notifications",
        populate: {path: "sender", select: "_id username"},
        options: { sort: { createdAt: "desc" } }
      })
      .limit(10);

    return res.status(200).json(foundUser);
  } catch (err) {
    return next(err);
  }
};

exports.addUserInfo = async (req, res, next) => {
  let userInfo = verifyUserInfo(req.body);

  try {
    await db.User.findByIdAndUpdate(
      req.params.id,
      userInfo,
      (err, updatedUser) => {
        if (err) return res.send(err);
        return res
          .status(200)
          .json({ message: "Profile info updated successfully" });
      }
    );
  } catch (error) {
    return next(error);
  }
};

exports.readNotifications = async function(req, res, next) {
  try {
    await db.Notification.update(
      { _id: { $in: req.body } },
      { $set: { read: true } },
      { multi: true }
    );

    return res.status(200).json({ message: "Notifications read" });
  } catch (error) {
    return next(error);
  }
};

exports.uploadImage = (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  let form = new formidable.IncomingForm();
  form.keepFilenames = true;
  form.uploadDir = path.join(__dirname, "../") + "/uploads";
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024;
  form.multiples = false;
  form.headers = req.headers;

  form.parse(req, function(err, field, file) {
    let filePath = file.image.path;
    if (err) {
      res.json({
        message: `Cannot upload image. Error is ${err}`
      });
    }

    if (file.image.type !== "image/png" && file.image.type !== "image/jpeg") {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "invalid file type" });
    }

    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });

    cloudinary.uploader.upload(
      filePath,
      {
        tags: "profileImage",
        resource_type: "image"
      },
      function(err, image) {
        try {
          if (err) return res.send(err);
          fs.unlinkSync(filePath);
          db.User.findById(req.params.id, (err, user) => {
            if (err) {
              res.json({
                status: 400,
                message: "You cannot perform this action"
              });
            }
            user.profileImage = image.url;
            user.save();
            return res
              .status(200)
              .json({ message: "Image uploaded successfully!" });
          });
        } catch (error) {
          return next({
            status: 400,
            message: "An error occured"
          });
        }
      }
    );
  });
};
