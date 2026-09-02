import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

// Initialize Database connection for serverless function
connectDB();

export default app;
