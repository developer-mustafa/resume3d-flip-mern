import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Certificate name is required'],
    trim: true,
    maxlength: 300,
  },
  issuer: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200,
  },
  issueDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  credentialId: {
    type: String,
    default: '',
    trim: true,
  },
  credentialUrl: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Certification', certificationSchema);
