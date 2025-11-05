require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'test123',
    phone: '9876543210',
    isEnrolled: false,
    isAdmin: false
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'test123',
    phone: '9876543211',
    isEnrolled: true,
    isAdmin: false,
    enrolledDate: new Date('2024-11-01')
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'test123',
    phone: '9876543212',
    isEnrolled: true,
    isAdmin: false,
    enrolledDate: new Date('2024-10-15')
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: 'test123',
    phone: '9876543213',
    isEnrolled: false,
    isAdmin: false
  },
  {
    name: 'Test Admin',
    email: 'testadmin@gammaprep.com',
    password: 'admin123',
    phone: '9999999999',
    isEnrolled: false,
    isAdmin: true
  }
];

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let created = 0;
    let skipped = 0;

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  Skipped: ${userData.email} (already exists)`);
        skipped++;
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created: ${userData.name} (${userData.email}) - ${userData.isAdmin ? 'Admin' : userData.isEnrolled ? 'Enrolled' : 'Not Enrolled'}`);
      created++;
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Created: ${created} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users (already exist)`);
    console.log('═══════════════════════════════════════════\n');

    console.log('🎯 Test Users Created:\n');
    console.log('Regular Users (Not Enrolled):');
    console.log('  📧 john@example.com | 🔑 test123 | ❌ Not Enrolled');
    console.log('  📧 sarah@example.com | 🔑 test123 | ❌ Not Enrolled\n');
    
    console.log('Enrolled Users:');
    console.log('  📧 jane@example.com | 🔑 test123 | ✅ Enrolled');
    console.log('  📧 mike@example.com | 🔑 test123 | ✅ Enrolled\n');
    
    console.log('Admin User:');
    console.log('  📧 testadmin@gammaprep.com | 🔑 admin123 | ⚡ Admin\n');
    
    console.log('🔗 Login and go to: http://localhost:3000/admin\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createTestUsers();



