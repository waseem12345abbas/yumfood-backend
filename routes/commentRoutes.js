const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment, toggleCommentLike } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.get('/post/:postId', getComments);
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, toggleCommentLike);

module.exports = router;
