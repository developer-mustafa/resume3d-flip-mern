import SiteSettings from '../models/SiteSettings.js';
import { logActivity } from '../utils/activityLogger.js';

// Public: Get settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Admin: Update settings
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    await logActivity(req, 'settings_update', 'SiteSettings', settings._id);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
