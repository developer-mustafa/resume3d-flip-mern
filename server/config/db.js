import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-book';
    const conn = await mongoose.connect(uri, { family: 4 });
    console.log(`  ✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('  ❌ MongoDB connection error:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};
