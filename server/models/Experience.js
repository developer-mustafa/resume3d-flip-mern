import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: 200,
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: 200,
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship', ''],
    default: '',
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000,
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  technologies: {
    type: [String],
    default: [],
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

experienceSchema.index({ status: 1, order: 1 });

export default mongoose.model('Experience', experienceSchema);
