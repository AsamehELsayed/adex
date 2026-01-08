import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import User from '../models/User.js';

dotenv.config();

async function seedUsers() {
  try {
    await connectDB();
    console.log('✅ Database connected');

    // Default users to seed
    const usersToSeed = [
      {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@adex.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        isActive: true,
      },
      // You can add more users here
      // {
      //   username: 'editor',
      //   email: 'editor@adex.com',
      //   password: 'editor123',
      //   role: 'editor',
      //   isActive: true,
      // },
    ];

    console.log('🔄 Seeding users...\n');

    for (const userData of usersToSeed) {
      // Check if user already exists
      let existingUser = await User.findOne({
        where: { username: userData.username }
      });
      
      if (!existingUser) {
        existingUser = await User.findOne({
          where: { email: userData.email }
        });
      }

      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.username} (${userData.email})`);
        continue;
      }

      // Create user
      const user = await User.create(userData);

      console.log(`✅ User created successfully!`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: ${userData.password}`);
      console.log('');
    }

    console.log('✅ User seeding complete!');
    console.log('\n⚠️  Please change default passwords after first login!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedUsers();

