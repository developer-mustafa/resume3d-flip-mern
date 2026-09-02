import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    default: '',
    maxlength: 300,
  },
  description: {
    type: String,
    default: '',
    maxlength: 5000,
  },
  category: {
    type: String,
    default: '',
    trim: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: '',
  },
  gallery: {
    type: [String],
    default: [],
  },
  githubUrl: {
    type: String,
    default: '',
    trim: true,
  },
  liveUrl: {
    type: String,
    default: '',
    trim: true,
  },
  caseStudyUrl: {
    type: String,
    default: '',
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

projectSchema.index({ status: 1, featured: -1, order: 1 });

// Auto-generate slug from title if not provided
projectSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Project', projectSchema);
