import 'dotenv/config';
import dns from 'dns';
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n  🚀 Server running on port ${PORT}`);
      console.log(`  📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  🔗 API: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
