const db = require("../models");
const formidable = require("formidable");
const { verifyUserInfo } = require("../utils/validators");

exports.getUserInfo = async function(req, res, next) {
  try {
    let user = await db.User.findById(req.params.id);
    let likesArr = await db.Likes.find();
    likesArr.map(like => {
      if(like.user === user._id) {
        user.likes.push(like.id)
      }
    })
    await user.save();
    const {
      username,
      profileImage,
      id,
      bio,
      website,
      location,
      likes,
      createdAt
    } = user;
    return res.status(200).json({ id, username, profileImage, bio, website, location, likes, createdAt });
  } catch (err) {
    return next(err);
  }
}

exports.addUserInfo = async (req, res, next) => {
  let userInfo = verifyUserInfo(req.body);

   try {
    await db.User.findByIdAndUpdate(req.params.id, userInfo, (err, updatedUser)=> {
      if(err) return res.send(err)
      return res.status(200).json({message: "Profile info updated successfully"});
    })     
   } catch (error) {
     return next(error);
   }
}

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
            return res.status(200).json({ message: "Image uploaded successfully!"});
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
