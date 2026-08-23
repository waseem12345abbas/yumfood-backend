const express = require('express');
const router = express.Router();
const {
  getPosts, getPost, getTrendingPosts, getFeaturedPosts, getRelatedPosts,
  createPost, updatePost, deletePost, toggleLike, toggleBookmark,
  getMyPosts, getAllPostsAdmin, updatePostStatus,
} = require('../controllers/postController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// Public
router.get('/', getPosts);
router.get('/trending', getTrendingPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:slug', optionalAuth, getPost);
router.get('/:id/related', getRelatedPosts);

// Protected
router.post('/', protect, createPost);
router.get('/user/my-posts', protect, getMyPosts);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.put('/:id/bookmark', protect, toggleBookmark);

// Admin
router.get('/admin/all', protect, adminOnly, getAllPostsAdmin);
router.put('/:id/status', protect, adminOnly, updatePostStatus);

module.exports = router;
