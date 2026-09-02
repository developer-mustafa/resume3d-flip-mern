import mongoose from 'mongoose';

const seoSettingsSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    default: 'Mustafa Rahman — Full Stack Software Engineer',
    trim: true,
    maxlength: 70,
  },
  metaDescription: {
    type: String,
    default: 'Full Stack Software Engineer specializing in modern web applications, SaaS architecture, and AI-powered products.',
    trim: true,
    maxlength: 160,
  },
  keywords: {
    type: [String],
    default: ['software engineer', 'full stack developer', 'web developer', 'react', 'node.js'],
  },
  canonicalUrl: {
    type: String,
    default: '',
    trim: true,
  },
  ogTitle: {
    type: String,
    default: 'Mustafa Rahman — Full Stack Software Engineer',
    trim: true,
  },
  ogDescription: {
    type: String,
    default: 'Interactive 3D Resume Book — Full Stack Software Engineer Portfolio',
    trim: true,
  },
  ogImage: {
    type: String,
    default: '',
  },
  twitterImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('SEOSettings', seoSettingsSchema);
