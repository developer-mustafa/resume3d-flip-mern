import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import projectRoutes from './routes/projects.js';
import educationRoutes from './routes/education.js';
import certificationRoutes from './routes/certifications.js';
import serviceRoutes from './routes/services.js';
import socialLinkRoutes from './routes/socialLinks.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import seoRoutes from './routes/seo.js';
import adminRoutes from './routes/admin.js';
import mediaRoutes from './routes/media.js';
import emailSettingsRoutes from './routes/emailSettings.js';

const app = express();

// ── Security Middleware ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // Skip rate limiting in development
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 30,
  message: { error: 'Too many login attempts, please try again later.' },
  skip: () => isDev, // Skip rate limiting in development
});

// ── Body Parsing ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ── Sanitization ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// ── Static Files ─────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── API Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', apiLimiter, profileRoutes);
app.use('/api/skills', apiLimiter, skillRoutes);
app.use('/api/experience', apiLimiter, experienceRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/education', apiLimiter, educationRoutes);
app.use('/api/certifications', apiLimiter, certificationRoutes);
app.use('/api/services', apiLimiter, serviceRoutes);
app.use('/api/social-links', apiLimiter, socialLinkRoutes);
app.use('/api/contact', apiLimiter, contactRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);
app.use('/api/email-settings', apiLimiter, emailSettingsRoutes);
app.use('/api/seo', apiLimiter, seoRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/media', apiLimiter, mediaRoutes);

// ── Health Check ─────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to 3D Resume API', version: '1.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve Static Assets in Production ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// ── Error Handling ───────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
