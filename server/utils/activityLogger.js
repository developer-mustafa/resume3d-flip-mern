import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (req, action, resource, resourceId = '', metadata = {}) => {
  try {
    await ActivityLog.create({
      userId: req.admin?._id,
      action,
      resource,
      resourceId: resourceId?.toString() || '',
      metadata,
      ip: req.ip || req.connection?.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
    });
  } catch (error) {
    // Don't let logging errors break the main flow
    console.error('Activity log error:', error.message);
  }
};
