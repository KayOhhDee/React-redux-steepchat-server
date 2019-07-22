const db = require("../models");
const formidable = require("formidable");


exports.uploadImage = (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  let form = new formidable.IncomingForm();
  form.keepFilenames = true;
  form.uploadDir = path.join(__dirname, "../") + "/uploads";
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024;
  form.multiples = false;

  form.parse(req, function(err, fields, file) {
    let filePath = file[""].path;
    if (err) {
      res.json({
        message: `Cannot upload image. Error is ${err}`
      });
    }

    if (file[""].type !== "image/png" && file[""].type !== "image/jpeg") {
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
            return res.status(200).json({ profileImage: user.profileImage });
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
