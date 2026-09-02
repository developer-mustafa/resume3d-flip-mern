import { logActivity } from '../utils/activityLogger.js';
import { AppError } from '../middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';

// Upload file (abstracted — currently uses local filesystem)
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    await logActivity(req, 'create', 'Media', '', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });

    res.status(201).json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    next(error);
  }
};

// Delete file
export const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(process.cwd(), 'uploads', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await logActivity(req, 'delete', 'Media', '', { filename });
    res.json({ message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};

// List uploaded files
export const listFiles = async (req, res, next) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadsDir)
      .filter((f) => f !== '.gitkeep')
      .map((filename) => {
        const stats = fs.statSync(path.join(uploadsDir, filename));
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      });

    res.json(files);
  } catch (error) {
    next(error);
  }
};
