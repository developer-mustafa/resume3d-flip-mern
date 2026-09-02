import { Router } from 'express';
import {
  getDashboardStats,
  getAdminUsers,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getActivityLogs,
} from '../controllers/adminController.js';
import { createAdminValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/dashboard', authorize('superadmin', 'admin', 'editor'), getDashboardStats);
router.get('/users', authorize('superadmin'), getAdminUsers);
router.post('/users', authorize('superadmin'), createAdminValidator, validate, createAdmin);
router.put('/users/:id', authorize('superadmin'), updateAdmin);
router.delete('/users/:id', authorize('superadmin'), deleteAdmin);
router.get('/activity-logs', authorize('superadmin', 'admin'), getActivityLogs);

export default router;
