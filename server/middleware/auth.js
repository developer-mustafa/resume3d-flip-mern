import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { AppError } from './errorHandler.js';

export const auth = async (req, res, next) => {
  try {
    let token;

    // Check HTTP-only cookie first, then Authorization header
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      throw new AppError('User not found', 401);
    }

    if (!admin.isActive) {
      throw new AppError('Account deactivated', 403);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Authentication failed', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new AppError('Authentication required', 401));
    }
    if (!roles.includes(req.admin.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};
