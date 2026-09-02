import Profile from '../models/Profile.js';
import { logActivity } from '../utils/activityLogger.js';

// Public: Get profile
export const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// Admin: Update profile
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    await logActivity(req, 'update', 'profile', profile._id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
