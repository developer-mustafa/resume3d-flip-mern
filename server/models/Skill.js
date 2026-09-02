import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: 100,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'AI', 'Tools'],
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', ''],
    default: '',
  },
  icon: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
}, {
  timestamps: true,
});

skillSchema.index({ category: 1, status: 1, order: 1 });

export default mongoose.model('Skill', skillSchema);
