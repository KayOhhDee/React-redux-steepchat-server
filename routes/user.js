const express = require("express");
const router = express.Router({ mergeParams: true });
const { uploadImage, getUserInfo, addUserInfo } = require('../handlers/user');;

router
  .route("/")
  .get(getUserInfo)
  .put(addUserInfo)

router.put("/image", uploadImage);

module.exports = router;