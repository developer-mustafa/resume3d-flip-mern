import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createAdminValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['superadmin', 'admin', 'editor']).withMessage('Invalid role'),
];

export const profileValidator = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('location').optional().trim(),
  body('bio').optional().isLength({ max: 2000 }),
  body('email').optional().trim(),
  body('phone').optional().trim(),
  body('website').optional().trim(),
];

export const skillValidator = [
  body('name').trim().notEmpty().withMessage('Skill name is required').isLength({ max: 100 }),
  body('category').isIn(['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'AI', 'Tools']).withMessage('Invalid category'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert', '']),
  body('order').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const experienceValidator = [
  body('company').trim().notEmpty().withMessage('Company name is required').isLength({ max: 200 }),
  body('position').trim().notEmpty().withMessage('Position is required').isLength({ max: 200 }),
  body('location').optional().trim(),
  body('employmentType').optional().isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship', '']),
  body('description').optional().isLength({ max: 2000 }),
  body('responsibilities').optional().isArray(),
  body('technologies').optional().isArray(),
  body('order').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const projectValidator = [
  body('title').trim().notEmpty().withMessage('Project title is required').isLength({ max: 200 }),
  body('slug').optional().trim().isLength({ max: 250 }),
  body('shortDescription').optional().isLength({ max: 300 }),
  body('description').optional().isLength({ max: 5000 }),
  body('technologies').optional().isArray(),
  body('features').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('order').optional().isInt({ min: 0 }),
];

export const educationValidator = [
  body('institution').trim().notEmpty().withMessage('Institution name is required').isLength({ max: 200 }),
  body('degree').optional().trim().isLength({ max: 200 }),
  body('field').optional().trim().isLength({ max: 200 }),
  body('description').optional().isLength({ max: 2000 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const certificationValidator = [
  body('name').trim().notEmpty().withMessage('Certificate name is required').isLength({ max: 300 }),
  body('issuer').optional().trim().isLength({ max: 200 }),
  body('credentialId').optional().trim(),
  body('credentialUrl').optional().trim(),
  body('description').optional().isLength({ max: 1000 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const serviceValidator = [
  body('title').trim().notEmpty().withMessage('Service title is required').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('icon').optional().trim(),
  body('order').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const socialLinkValidator = [
  body('platform').trim().notEmpty().withMessage('Platform is required').isLength({ max: 50 }),
  body('url').trim().notEmpty().withMessage('URL is required'),
  body('label').optional().trim().isLength({ max: 100 }),
  body('icon').optional().trim(),
  body('order').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['published', 'draft']),
];

export const contactMessageValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
];

export const settingsValidator = [
  body('bookTitle').optional().trim(),
  body('bookSubtitle').optional().trim(),
  body('accentColor').optional().trim(),
  body('paperColor').optional().trim(),
  body('backgroundColor').optional().trim(),
  body('animationSpeed').optional().isInt({ min: 200, max: 2000 }),
  body('defaultPage').optional().isInt({ min: 0, max: 4 }),
  body('bookMode').optional().isIn(['desktop-spread', 'mobile-single-page']),
];

export const seoValidator = [
  body('metaTitle').optional().trim().isLength({ max: 70 }),
  body('metaDescription').optional().trim().isLength({ max: 160 }),
  body('keywords').optional().isArray(),
  body('canonicalUrl').optional().trim(),
  body('ogTitle').optional().trim(),
  body('ogDescription').optional().trim(),
];
