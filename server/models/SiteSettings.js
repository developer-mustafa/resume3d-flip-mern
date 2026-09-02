import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    default: 'MUSTAFA RAHMAN',
    trim: true,
  },
  bookSubtitle: {
    type: String,
    default: 'FULL STACK SOFTWARE ENGINEER',
    trim: true,
  },
  accentColor: {
    type: String,
    default: '#2563eb',
    trim: true,
  },
  paperColor: {
    type: String,
    default: '#faf9f6',
    trim: true,
  },
  backgroundColor: {
    type: String,
    default: '#1a1a1a',
    trim: true,
  },
  animationSpeed: {
    type: Number,
    default: 800,
    min: 200,
    max: 2000,
  },
  showPageNumbers: {
    type: Boolean,
    default: true,
  },
  showSocialLinks: {
    type: Boolean,
    default: true,
  },
  showSections: {
    type: Map,
    of: Boolean,
    default: {
      cover: true,
      profile: true,
      experience: true,
      projects: true,
      contact: true,
    },
  },
  defaultPage: {
    type: Number,
    default: 0,
    min: 0,
    max: 4,
  },
  bookMode: {
    type: String,
    enum: ['desktop-spread', 'mobile-single-page'],
    default: 'desktop-spread',
  },
}, {
  timestamps: true,
});

export default mongoose.model('SiteSettings', siteSettingsSchema);
