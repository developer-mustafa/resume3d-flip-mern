import { Router } from 'express';
import { submitMessage, getMessages, updateStatus, deleteMessage } from '../controllers/contactController.js';
import { contactMessageValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth, authorize } from '../middleware/auth.js';

const router = Router();

// Public
router.post('/', contactMessageValidator, validate, submitMessage);

// Admin
router.get('/', auth, authorize('superadmin', 'admin'), getMessages);
router.put('/:id/status', auth, authorize('superadmin', 'admin'), updateStatus);
router.delete('/:id', auth, authorize('superadmin', 'admin'), deleteMessage);

export default router;
