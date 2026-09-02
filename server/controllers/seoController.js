import SEOSettings from '../models/SEOSettings.js';
import { logActivity } from '../utils/activityLogger.js';

export const getSEO = async (req, res, next) => {
  try {
    let seo = await SEOSettings.findOne();
    if (!seo) {
      seo = await SEOSettings.create({});
    }
    res.json(seo);
  } catch (error) {
    next(error);
  }
};

export const updateSEO = async (req, res, next) => {
  try {
    let seo = await SEOSettings.findOne();
    if (!seo) {
      seo = await SEOSettings.create(req.body);
    } else {
      Object.assign(seo, req.body);
      await seo.save();
    }
    await logActivity(req, 'settings_update', 'SEOSettings', seo._id);
    res.json(seo);
  } catch (error) {
    next(error);
  }
};
