import { Router } from 'express';
import * as ctrl from '../controllers/projectController.js';
import { projectValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', ctrl.getAll);
router.get('/slug/:slug', ctrl.getBySlug);

// Admin
router.get('/admin', auth, authorize('superadmin', 'admin'), ctrl.adminGetAll);
router.post('/', auth, authorize('superadmin', 'admin', 'editor'), projectValidator, validate, ctrl.create);
router.put('/:id', auth, authorize('superadmin', 'admin', 'editor'), projectValidator, validate, ctrl.update);
router.delete('/:id', auth, authorize('superadmin', 'admin'), ctrl.remove);
router.post('/:id/duplicate', auth, authorize('superadmin', 'admin'), ctrl.duplicate);

export default router;
