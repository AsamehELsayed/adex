import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import User from '../models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    await connectDB();
    console.log('✅ Database connected');

    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@adex.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    let existingUser = await User.findOne({
      where: { username }
    });
    
    if (!existingUser) {
      existingUser = await User.findOne({
        where: { email }
      });
    }

    if (existingUser) {
      console.log('⚠️  Admin user already exists');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      return;
    }

    // Create admin user
    const admin = await User.create({
      username,
      email,
      password,
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdmin();

