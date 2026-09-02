import 'dotenv/config';
import dns from 'dns';
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}
import mongoose from 'mongoose';
import Admin from './models/Admin.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-book';
const email = 'mustafa.rahman.official@gmail.com';
const password = 'Password@123'; // Default password

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = await Admin.create({
        name: 'Mustafa Rahman',
        email,
        password,
        role: 'superadmin',
      });
      console.log('✅ Superadmin created successfully!');
    } else {
      admin.password = password;
      await admin.save();
      console.log('✅ Superadmin password updated to default!');
    }
    
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}\n`);
    console.log('You can now log in at http://localhost:5173/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
