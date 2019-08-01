const express = require("express");
const router = express.Router({ mergeParams: true });
const { uploadImage, getUserInfo, addUserInfo, readNotifications } = require('../handlers/user');;

router
  .route("/")
  .get(getUserInfo)
  .put(addUserInfo)

router.post("/notifications", readNotifications);

router.put("/image", uploadImage);

module.exports = router;