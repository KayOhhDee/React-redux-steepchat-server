const express = require('express');
const router = express.Router();
const { signup, signin, uploadImage } = require('../handlers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/user/:id/image', uploadImage);

module.exports = router;