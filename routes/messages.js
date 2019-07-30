const express = require('express');
const router = express.Router({ mergeParams: true });

const { 
  createMessage,
  getMessage,
  deleteMessage, 
  postComment 
} = require("../handlers/messages");

router.post('/', createMessage);
router.post('/:message_id/comment', postComment);

router
  .route('/:message_id')
  .get(getMessage)
  .delete(deleteMessage);

module.exports = router;