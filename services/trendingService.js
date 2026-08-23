const Post = require('../models/Post');

/**
 * Trending Score Algorithm
 * score = views + (likes × 3) + (comments × 5) − decay(age)
 *
 * Run this as a cron job (e.g. every hour) to keep isTrending fresh.
 */
const updateTrendingPosts = async () => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('commentCount')
      .select('views likes isTrending createdAt');

    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const scored = posts.map((post) => {
      const ageInDays = (now - new Date(post.createdAt).getTime()) / DAY_MS;
      const decay = Math.pow(0.9, ageInDays); // 10 % decay per day
      const score =
        (post.views + post.likes.length * 3 + (post.commentCount || 0) * 5) * decay;
      return { id: post._id, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const topIds = new Set(scored.slice(0, 10).map((p) => p.id.toString()));

    // Batch update
    await Promise.all(
      posts.map((post) =>
        Post.findByIdAndUpdate(post._id, {
          isTrending: topIds.has(post._id.toString()),
        })
      )
    );

    console.log(`✅ Trending updated — top ${topIds.size} posts marked`);
  } catch (err) {
    console.error('❌ Trending update failed:', err.message);
  }
};

module.exports = { updateTrendingPosts };
