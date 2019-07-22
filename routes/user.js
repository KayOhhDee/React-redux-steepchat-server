const express = require("express");
const router = express.Router({ mergeParams: true });
const { uploadImage } = require('../handlers/user');;

router.put("/image", uploadImage);

module.exports = router;