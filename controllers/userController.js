const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password');

  res.json({ success: true, users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// @desc    Get user by ID or username
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -bookmarks');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const posts = await Post.find({ author: user._id, status: 'published' })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('category', 'name slug color')
    .select('-content');

  res.json({ success: true, user, posts });
});

// @desc    Toggle user active status (admin)
// @route   PUT /api/users/:id/toggle-status
// @access  Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
});

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
// @access  Admin
const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await Post.deleteMany({ author: user._id });
  await user.deleteOne();

  res.json({ success: true, message: 'User and their posts deleted' });
});

// @desc    Get admin analytics
// @route   GET /api/users/admin/analytics
// @access  Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'draft' }),
    Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
  ]);

  const recentPosts = await Post.find({ status: 'draft' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name username')
    .populate('category', 'name')
    .select('title status createdAt');

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews[0]?.total || 0,
    },
    recentPosts,
  });
});

module.exports = { getUsers, getUser, toggleUserStatus, updateRole, deleteUser, getAnalytics };
