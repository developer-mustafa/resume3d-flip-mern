import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { profileValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getProfile);
router.put('/', auth, authorize('superadmin', 'admin', 'editor'), profileValidator, validate, updateProfile);

export default router;
