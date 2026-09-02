import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    trim: true,
    maxlength: 50,
  },
  label: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100,
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
  },
  icon: {
    type: String,
    default: '',
    trim: true,
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

socialLinkSchema.index({ platform: 1, status: 1 });

export default mongoose.model('SocialLink', socialLinkSchema);
