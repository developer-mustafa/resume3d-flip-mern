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
    
    const htmlTemplate = `
      <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; background-color: #1e293b; padding: 20px;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">Resume3D CMS</h2>
          </div>
          <div style="padding: 30px 20px;">
            <h1 style="font-size: 20px; margin-bottom: 20px; color: #0f172a;">You have requested a password change</h1>
            <p style="color: #475569; line-height: 1.6;">We received a request to reset the password for your account. To proceed, please click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #f59e0b; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #475569; line-height: 1.6;">Or copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a></p>
            <p style="color: #ef4444; font-size: 13px; margin-top: 20px;">This link will expire in 30 minutes.</p>
            <p style="color: #475569; line-height: 1.6; margin-top: 20px;">If you didn't request this password reset, please ignore this email or let us know immediately. Your account remains secure.</p>
          </div>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px;">This is an automated message from your Resume3D Platform.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: admin.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: htmlTemplate
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

