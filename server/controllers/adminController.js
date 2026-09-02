import Admin from '../models/Admin.js';
import ActivityLog from '../models/ActivityLog.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Certification from '../models/Certification.js';
import ContactMessage from '../models/ContactMessage.js';
import { logActivity } from '../utils/activityLogger.js';
import { AppError } from '../middleware/errorHandler.js';

// Dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalSkills,
      totalExperience,
      totalCertifications,
      unreadMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Certification.countDocuments(),
      ContactMessage.countDocuments({ status: 'unread' }),
    ]);

    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.json({
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalSkills,
        totalExperience,
        totalCertifications,
        unreadMessages,
      },
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

// Admin user management
export const getAdminUsers = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) {
      throw new AppError('Email already registered', 400);
    }

    const admin = await Admin.create({ name, email, password, role });
    await logActivity(req, 'create', 'Admin', admin._id);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    await admin.save();

    await logActivity(req, 'update', 'Admin', admin._id);
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    await logActivity(req, 'delete', 'Admin', admin._id);
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    next(error);
  }
};

// Activity logs
export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const total = await ActivityLog.countDocuments();
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    res.json({
      items: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
