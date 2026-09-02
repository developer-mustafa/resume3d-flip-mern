import { Router } from 'express';
import { getEmailSettings, updateEmailSettings } from '../controllers/emailSettingsController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// Ensure only superadmin can manage email settings
router.use(auth);
router.use(authorize('superadmin'));

router.get('/', getEmailSettings);
router.put('/', updateEmailSettings);

export default router;
