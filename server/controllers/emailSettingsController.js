import EmailSettings from '../models/EmailSettings.js';
import { logActivity } from '../utils/activityLogger.js';

export const getEmailSettings = async (req, res, next) => {
  try {
    let settings = await EmailSettings.findOne();
    if (!settings) {
      settings = await EmailSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateEmailSettings = async (req, res, next) => {
  try {
    let settings = await EmailSettings.findOne();
    if (!settings) {
      settings = new EmailSettings();
    }

    const {
      provider,
      fromEmail,
      toEmail,
      enableContactAlerts,
      enablePasswordReset,
      resendApiKey,
      sendgridApiKey,
      emailjsServiceId,
      emailjsTemplateId,
      emailjsPublicKey,
      emailjsPrivateKey,
    } = req.body;

    if (provider !== undefined) settings.provider = provider;
    if (fromEmail !== undefined) settings.fromEmail = fromEmail;
    if (toEmail !== undefined) settings.toEmail = toEmail;
    if (enableContactAlerts !== undefined) settings.enableContactAlerts = enableContactAlerts;
    if (enablePasswordReset !== undefined) settings.enablePasswordReset = enablePasswordReset;
    
    // Only update API keys if they are provided (prevent overwriting with empty string if hidden)
    if (resendApiKey) settings.resendApiKey = resendApiKey;
    if (sendgridApiKey) settings.sendgridApiKey = sendgridApiKey;
    if (emailjsServiceId) settings.emailjsServiceId = emailjsServiceId;
    if (emailjsTemplateId) settings.emailjsTemplateId = emailjsTemplateId;
    if (emailjsPublicKey) settings.emailjsPublicKey = emailjsPublicKey;
    if (emailjsPrivateKey) settings.emailjsPrivateKey = emailjsPrivateKey;

    await settings.save();
    await logActivity(req, 'update', 'EmailSettings', settings._id);

    res.json(settings);
  } catch (error) {
    next(error);
  }
};
