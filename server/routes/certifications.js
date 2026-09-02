import { Router } from 'express';
import * as ctrl from '../controllers/certificationController.js';
import { certificationValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/admin', auth, authorize('superadmin', 'admin'), ctrl.adminGetAll);
router.post('/', auth, authorize('superadmin', 'admin', 'editor'), certificationValidator, validate, ctrl.create);
router.put('/:id', auth, authorize('superadmin', 'admin', 'editor'), certificationValidator, validate, ctrl.update);
router.delete('/:id', auth, authorize('superadmin', 'admin'), ctrl.remove);

export default router;
