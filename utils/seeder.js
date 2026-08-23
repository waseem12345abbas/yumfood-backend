const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');
const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
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

const seedDB = async () => {
  await connectDB();

  // Clear existing
  await Category.deleteMany();
  console.log('📦 Categories cleared');

  // Seed categories
  await Category.insertMany(categories);
  console.log('✅ Categories seeded');

  // Create admin user if not exists
  const adminExists = await User.findOne({ email: 'admin@yumfood.com' });
  if (!adminExists) {
    await User.create({
      name: 'YumFood Admin',
      username: 'yumfood_admin',
      email: 'admin@yumfood.com',
      password: 'Admin@1234',
      role: 'admin',
      bio: 'Administrator of YumFood platform',
    });
    console.log('✅ Admin user created: admin@yumfood.com / Admin@1234');
  }

  console.log('🎉 Database seeded successfully!');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
