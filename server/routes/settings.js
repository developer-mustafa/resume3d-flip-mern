import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { settingsValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', auth, authorize('superadmin', 'admin'), settingsValidator, validate, updateSettings);

export default router;
