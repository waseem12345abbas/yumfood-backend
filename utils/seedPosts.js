const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');
const Category = require('../models/Category');
const Post = require('../models/Post');
const User = require('../models/User');

const CATEGORIES = [
  {
    name: 'Food',
    slug: 'food',
    description: 'Recipes, restaurants, food culture, and culinary adventures',
    icon: '🍕',
    color: '#FF6B35',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    name: 'Tech',
    slug: 'tech',
    description: 'Technology news, tutorials, and innovations',
    icon: '💻',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business strategy, entrepreneurship, and market insights',
    icon: '📈',
    color: '#10B981',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    name: 'Crypto',
    slug: 'crypto',
    description: 'Cryptocurrency, blockchain, DeFi, and Web3',
    icon: '₿',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'AI',
    slug: 'ai',
    description: 'Artificial intelligence, machine learning, and future tech',
    icon: '🤖',
    color: '#8B5CF6',
    gradient: 'from-purple-400 to-pink-500',
  },
];

const AUTHOR_EMAIL = 'admin@yumfood.com';
const AUTHOR_PASSWORD = 'Admin@1234';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function makeParagraphs(topic) {
  const p1 = `In this guide, we’ll explore the essentials of ${topic}. We break the topic into practical steps you can actually use right away.`;
  const p2 = `Next, we discuss common mistakes people make when learning about ${topic} and how to avoid them.`;
  const p3 = `Finally, you’ll get a simple checklist you can follow to apply what you learned about ${topic} in real projects and day-to-day decisions.`;
  const p4 = `Bonus: consider how ${topic} connects to current trends, tools, and best practices.`;
  const paragraphs = [p1, p2, p3, p4];
  // Shuffle-ish by randomly selecting 3-4
  const count = randInt(3, 4);
  const chosen = [];
  while (chosen.length < count) {
    const idx = randInt(0, paragraphs.length - 1);
    const text = paragraphs[idx];
    if (!chosen.includes(text)) chosen.push(text);
  }

  return chosen
    .map((t) => `<p>${t}</p>`)
    .join('\n');
}

function makeExcerpt(topic) {
  return `A quick, practical overview of ${topic}—what matters, why it matters, and how to get results.`;
}

function makeFeaturedImage(label) {
  // Post schema requires a string; a static URL is enough for seeded content.
  return `https://via.placeholder.com/1200x630.png?text=${encodeURIComponent(label)}`;
}

async function ensureCategories() {
  const idsBySlug = {};

  for (const c of CATEGORIES) {
    const existing = await Category.findOne({ slug: c.slug });
    if (existing) {
      idsBySlug[c.slug] = existing._id;
      continue;
    }

    const created = await Category.create({
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      color: c.color,
      gradient: c.gradient,
    });
    idsBySlug[c.slug] = created._id;
  }

  return idsBySlug;
}

async function ensureAdmin() {
  let admin = await User.findOne({ email: AUTHOR_EMAIL });
  if (admin) return admin;

  admin = await User.create({
    name: 'YumFood Admin',
    username: 'yumfood_admin',
    email: AUTHOR_EMAIL,
    password: AUTHOR_PASSWORD,
    role: 'admin',
    bio: 'Administrator of YumFood platform',
  });

  console.log(`✅ Admin user created: ${AUTHOR_EMAIL}`);
  return admin;
}

function topicsForCategory(slug) {
  const map = {
    food: [
      'meal prep for busy weeks',
      'quick weeknight dinners',
      'healthy cooking swaps',
      'best spices for flavor',
      'restaurant-style sauces at home',
      'easy dessert ideas',
      'balanced nutrition habits',
      'how to plan a grocery list',
    ],
    tech: [
      'building REST APIs with Node.js',
      'frontend performance tips',
      'deployment checklists',
      'debugging strategies',
      'database indexing basics',
      'auth flows and security',
      'clean code practices',
      'designing scalable systems',
    ],
    business: [
      'pricing strategies that work',
      'marketing fundamentals for growth',
      'startup metrics to watch',
      'customer retention playbooks',
      'turning ideas into experiments',
      'competitive analysis tips',
      'leadership and team alignment',
      'business planning frameworks',
    ],
    crypto: [
      'blockchain basics',
      'DeFi explained',
      'wallet safety best practices',
      'understanding smart contracts',
      'tokenomics in plain language',
      'on-chain analytics for beginners',
      'how DAOs work',
      'risk management for crypto',
    ],
    ai: [
      'intro to machine learning',
      'prompt engineering techniques',
      'building AI prototypes',
      'evaluating model quality',
      'RAG concepts for apps',
      'ethics and safety considerations',
      'measuring AI performance',
      'hands-on ML project planning',
    ],
  };

  return map[slug] || ['general topic'];
}

async function seedPostsForCategory({ categoryId, categorySlug, categoryName, authorId }) {
  const existingPublishedCount = await Post.countDocuments({
    category: categoryId,
    status: 'published',
  });

  // As requested: clear existing published posts for these categories to prevent duplicates.
  if (existingPublishedCount > 0) {
    await Post.deleteMany({ category: categoryId, status: 'published' });
    console.log(`🧹 Cleared ${existingPublishedCount} published posts for ${categoryName}`);
  }

  const topics = topicsForCategory(categorySlug);
  const posts = [];

  for (let i = 1; i <= 20; i++) {
    const topic = pick(topics);
    const title = `${categoryName} Post ${i}: ${topic}`;
    const excerpt = makeExcerpt(topic);
    const content = makeParagraphs(topic);

    const post = new Post({
      title,
      excerpt,
      content,
      featuredImage: makeFeaturedImage(`${categoryName} - ${i}`),
      category: categoryId,
      author: authorId,
      status: 'published',
      tags: Array.from(
        new Set([
          categorySlug,
          ...topic
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()),
          pick(['guide', 'tips', 'explained', 'workflow', 'basics']),
          pick(['beginner', 'practical', 'modern', 'starter']),
        ])
      ).slice(0, randInt(3, 6)),
      metaTitle: `${categoryName}: ${topic}`,
      metaDescription: excerpt,
      isFeatured: Math.random() < 0.15,
      isTrending: Math.random() < 0.2,
      views: randInt(120, 15000),
      likes: [],
      bookmarks: [],
    });

    posts.push(post);
  }

  // Save one-by-one so Mongoose hooks (slug + readingTime) apply reliably.
  for (const p of posts) {
    await p.save();
  }

  console.log(`✅ Seeded 20 published posts for ${categoryName}`);
}

async function seedPosts() {
  await connectDB();

  const idsBySlug = await ensureCategories();
  const admin = await ensureAdmin();

  for (const c of CATEGORIES) {
    await seedPostsForCategory({
      categoryId: idsBySlug[c.slug],
      categorySlug: c.slug,
      categoryName: c.name,
      authorId: admin._id,
    });
  }

  console.log('🎉 Finished seeding post content for all categories.');
  process.exit(0);
}

seedPosts().catch((err) => {
  console.error('❌ seedPosts error:', err);
  process.exit(1);
});

