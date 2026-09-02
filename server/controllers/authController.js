import Admin from '../models/Admin.js';
import { generateToken, cookieOptions } from '../utils/jwt.js';
import { logActivity } from '../utils/activityLogger.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import EmailSettings from '../models/EmailSettings.js';
import crypto from 'crypto';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!admin.isActive) {
      throw new AppError('Account deactivated', 403);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);
    res.cookie('token', token, cookieOptions);

    await logActivity(
      { ...req, admin },
      'login',
      'auth',
      admin._id
    );

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logActivity(req, 'logout', 'auth', req.admin._id);

    res.cookie('token', '', {
      ...cookieOptions,
      maxAge: 0,
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    admin.password = newPassword;
    await admin.save();
    
    await logActivity(req, 'update', 'password', admin._id);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    const emailSettings = await EmailSettings.findOne();
    if (!emailSettings || !emailSettings.enablePasswordReset) {
      throw new AppError('Password reset is disabled or email not configured', 400);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await admin.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/admin/reset-password/${resetToken}`;
    
    await sendEmail({
      to: admin.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. The link is valid for 30 minutes.</p>`
    });

    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    next(error);
  }
};

