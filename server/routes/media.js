import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, deleteFile, listFiles } from '../controllers/mediaController.js';
import { auth, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new AppError('Only image and PDF files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

const router = Router();

router.use(auth, authorize('superadmin', 'admin', 'editor'));

router.get('/', listFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:filename', deleteFile);

export default router;
