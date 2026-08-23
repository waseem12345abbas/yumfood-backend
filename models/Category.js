const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: { type: String, default: '' },
    icon: { type: String, default: '📝' },
    color: { type: String, default: '#FF6B35' },
    gradient: { type: String, default: 'from-orange-400 to-red-500' },
    image: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { status: 'published' },
});

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
