const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({
    post: req.params.postId,
    parent: null,
    isApproved: true,
  })
    .sort({ createdAt: -1 })
    .populate('author', 'name username avatar')
    .populate({
      path: 'replies',
      match: { isApproved: true },
      populate: { path: 'author', select: 'name username avatar' },
      options: { sort: { createdAt: 1 } },
    });

  res.json({ success: true, comments });
});

// @desc    Add comment
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content, postId, parentId } = req.body;

  if (!content || !postId) {
    res.status(400);
    throw new Error('Content and postId are required');
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: postId,
    parent: parentId || null,
  });

  await comment.populate('author', 'name username avatar');

  res.status(201).json({ success: true, comment });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  await Comment.deleteMany({ parent: comment._id });
  await comment.deleteOne();

  res.json({ success: true, message: 'Comment deleted' });
});

// @desc    Toggle like on comment
// @route   PUT /api/comments/:id/like
// @access  Private
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const liked = comment.likes.includes(req.user._id);
  if (liked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    comment.likes.push(req.user._id);
  }
  await comment.save();

  res.json({ success: true, liked: !liked, likesCount: comment.likes.length });
});

module.exports = { getComments, addComment, deleteComment, toggleCommentLike };
