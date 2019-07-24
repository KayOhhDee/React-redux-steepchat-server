const express = require("express");
const router = express.Router({ mergeParams: true });
const { uploadImage, getUserInfo } = require('../handlers/user');;

router.get(getUserInfo)
router.put("/image", uploadImage);

module.exports = router;