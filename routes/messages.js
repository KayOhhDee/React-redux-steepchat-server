const express = require('express');
const router = express.Router({ mergeParams: true });

const { 
  createMessage,
  getMessage,
  deleteMessage, 
  postComment,
  likeMessage,
  unlikeMessage 
} = require("../handlers/messages");

router.post('/', createMessage);
router.post('/:message_id/comment', postComment);

router.get('/:message_id/like', likeMessage);
router.get('/:message_id/unlike', unlikeMessage);

router.delete('/:message_id', deleteMessage)


module.exports = router;