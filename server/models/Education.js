import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
    maxlength: 200,
  },
  degree: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200,
  },
  field: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000,
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
}, {
  timestamps: true,
});

educationSchema.index({ status: 1 });

export default mongoose.model('Education', educationSchema);
