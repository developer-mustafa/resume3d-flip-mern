import express from 'express';
import { generateResumePDF } from '../controllers/pdfController.js';

const router = express.Router();

// GET /api/resume/pdf - Generate and download resume PDF
router.get('/pdf', generateResumePDF);

export default router;
