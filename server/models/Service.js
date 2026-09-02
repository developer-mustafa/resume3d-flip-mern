import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  icon: {
    type: String,
    default: '',
    trim: true,
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

serviceSchema.index({ status: 1, order: 1 });

export default mongoose.model('Service', serviceSchema);
