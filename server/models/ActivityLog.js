import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'create', 'update', 'delete', 'publish', 'unpublish', 'settings_update'],
  },
  resource: {
    type: String,
    required: true,
    trim: true,
  },
  resourceId: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ip: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
