import { Router } from 'express';
import { login, logout, getMe, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js';
import { loginValidator } from '../validators/index.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginValidator, validate, login);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

// Password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', auth, changePassword);

export default router;
