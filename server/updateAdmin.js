import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/3dresume', { family: 4 }).then(async () => {
  const db = mongoose.connection.db;
  const Admin = db.collection('admins');
  
  const passwordHash = await bcrypt.hash('Password@123', 12);
  
  const result = await Admin.updateOne(
    { email: 'mustafa.rahman.official@gmail.com' },
    { $set: { password: passwordHash } }
  );

  console.log('Successfully updated password for mustafa.rahman.official@gmail.com to Password@123');
  process.exit(0);
}).catch(console.error);
