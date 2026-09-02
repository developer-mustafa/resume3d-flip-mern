import { Router } from 'express';
import { getSEO, updateSEO } from '../controllers/seoController.js';
import { seoValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getSEO);
router.put('/', auth, authorize('superadmin', 'admin'), seoValidator, validate, updateSEO);

export default router;
