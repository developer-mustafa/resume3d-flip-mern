import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 5000,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
  },
}, {
  timestamps: true,
});

contactMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
