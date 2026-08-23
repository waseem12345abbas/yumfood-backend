const asyncHandler = require('express-async-handler');
const stringSimilarity = require('string-similarity');
const Post = require('../models/Post');
const Category = require('../models/Category');

// Helper: check for duplicate
const checkDuplicate = async (title, content, excludeId = null) => {
  const query = excludeId ? { _id: { $ne: excludeId } } : {};
  const posts = await Post.find(query).select('title content');

  for (const post of posts) {
    const titleSim = stringSimilarity.compareTwoStrings(
      title.toLowerCase(),
      post.title.toLowerCase()
    );
    if (titleSim > 0.85) return true;

    const contentSim = stringSimilarity.compareTwoStrings(
      content.substring(0, 500).toLowerCase(),
      post.content.substring(0, 500).toLowerCase()
    );
    if (contentSim > 0.9) return true;
  }
  return false;
};

// @desc    Get all published posts (with filters/search/pagination)
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { status: 'published' };

  // Category filter
  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category });
    if (cat) query.category = cat._id;
  }

  // Tag filter
  if (req.query.tag) {
    query.tags = req.query.tag.toLowerCase();
  }

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Author filter
  if (req.query.author) {
    query.author = req.query.author;
  }

  // Sort
  let sortOption = { createdAt: -1 };
  if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
  if (req.query.sort === 'popular') sortOption = { views: -1 };
  if (req.query.sort === 'trending') sortOption = { likes: -1 };

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate('author', 'name username avatar')
    .populate('category', 'name slug color icon')
    .populate('commentCount')
    .select('-content');

  res.json({
    success: true,
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('author', 'name username avatar bio website twitter linkedin')
    .populate('category', 'name slug color icon gradient')
    .populate('commentCount');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({ success: true, post });
});

// @desc    Get trending posts
// @route   GET /api/posts/trending
// @access  Public
const getTrendingPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'published' })
    .sort({ views: -1, likes: -1 })
    .limit(parseInt(req.query.limit) || 6)
    .populate('author', 'name username avatar')
    .populate('category', 'name slug color icon')
    .select('-content');

  res.json({ success: true, posts });
});

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
const getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'published', isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name username avatar')
    .populate('category', 'name slug color icon')
    .select('-content');

  res.json({ success: true, posts });
});

// @desc    Get related posts
// @route   GET /api/posts/:id/related
// @access  Public
const getRelatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const related = await Post.find({
    _id: { $ne: post._id },
    category: post.category,
    status: 'published',
  })
    .sort({ views: -1 })
    .limit(4)
    .populate('author', 'name username avatar')
    .populate('category', 'name slug color')
    .select('-content');

  res.json({ success: true, posts: related });
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, tags, featuredImage, featuredImagePublicId, metaTitle, metaDescription, status } = req.body;

  if (!title || !excerpt || !content || !category || !featuredImage) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Duplicate check
  const isDuplicate = await checkDuplicate(title, content);
  if (isDuplicate) {
    res.status(400);
    throw new Error('This article already exists.');
  }

  const post = await Post.create({
    title,
    excerpt,
    content,
    category,
    tags: tags ? tags.map((t) => t.toLowerCase().trim()) : [],
    featuredImage,
    featuredImagePublicId: featuredImagePublicId || '',
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || excerpt,
    author: req.user._id,
    status: status || 'draft',
  });

  await post.populate('author', 'name username avatar');
  await post.populate('category', 'name slug color icon');

  res.status(201).json({ success: true, post });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Owner or admin check
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }

  const { title, content } = req.body;

  // Duplicate check if title/content changed
  if ((title && title !== post.title) || (content && content !== post.content)) {
    const isDuplicate = await checkDuplicate(
      title || post.title,
      content || post.content,
      post._id
    );
    if (isDuplicate) {
      res.status(400);
      throw new Error('This article already exists.');
    }
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('author', 'name username avatar')
    .populate('category', 'name slug color icon');

  res.json({ success: true, post });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted successfully' });
});

// @desc    Toggle like on post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const liked = post.likes.includes(req.user._id);
  if (liked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json({ success: true, liked: !liked, likesCount: post.likes.length });
});

// @desc    Toggle bookmark
// @route   PUT /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const bookmarked = post.bookmarks.includes(req.user._id);
  if (bookmarked) {
    post.bookmarks = post.bookmarks.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.bookmarks.push(req.user._id);
  }
  await post.save();

  // Also update user bookmarks
  const User = require('../models/User');
  const user = await User.findById(req.user._id);
  if (bookmarked) {
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== post._id.toString());
  } else {
    user.bookmarks.push(post._id);
  }
  await user.save();

  res.json({ success: true, bookmarked: !bookmarked });
});

// @desc    Get user's posts (dashboard)
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { author: req.user._id };
  if (req.query.status) query.status = req.query.status;

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug color icon')
    .populate('commentCount')
    .select('-content');

  res.json({
    success: true,
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Admin: Get all posts
// @route   GET /api/posts/admin/all
// @access  Admin
const getAllPostsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = {};
  if (req.query.status) query.status = req.query.status;

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name username email')
    .populate('category', 'name slug')
    .select('-content');

  res.json({
    success: true,
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Admin: Approve/reject post
// @route   PUT /api/posts/:id/status
// @access  Admin
const updatePostStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['published', 'rejected', 'draft'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('author', 'name username').populate('category', 'name');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({ success: true, post });
});

module.exports = {
  getPosts,
  getPost,
  getTrendingPosts,
  getFeaturedPosts,
  getRelatedPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  getMyPosts,
  getAllPostsAdmin,
  updatePostStatus,
};
