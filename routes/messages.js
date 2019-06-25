const express = require('express');
const router = express.Router({ mergeParams: true });

const { createMessage } = require('../handlers/messages');

router.post('/', createMessage);

module.exports = router;