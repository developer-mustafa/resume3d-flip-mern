import { Router } from 'express';
import * as ctrl from '../controllers/serviceController.js';
import { serviceValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/admin', auth, authorize('superadmin', 'admin'), ctrl.adminGetAll);
router.post('/', auth, authorize('superadmin', 'admin', 'editor'), serviceValidator, validate, ctrl.create);
router.put('/:id', auth, authorize('superadmin', 'admin', 'editor'), serviceValidator, validate, ctrl.update);
router.delete('/:id', auth, authorize('superadmin', 'admin'), ctrl.remove);

export default router;
