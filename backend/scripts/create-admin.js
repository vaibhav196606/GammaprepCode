require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@gammaprep.com',
      password: 'admin123',
      phone: '9876543210',
      isAdmin: true,
      isEnrolled: false
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  User already exists with this email!');
      console.log('Email:', existingAdmin.email);
      console.log('Current Admin Status:', existingAdmin.isAdmin);
      
      // Update to ensure it's admin
      if (!existingAdmin.isAdmin) {
        await User.findByIdAndUpdate(existingAdmin._id, { isAdmin: true });
        console.log('✅ Updated existing user to admin status');
        
        console.log('\n✅ Admin access granted!\n');
        console.log('═══════════════════════════════════');
        console.log('📧 Email:', existingAdmin.email);
        console.log('🔑 Password: (use your existing password)');
        console.log('👤 Name:', existingAdmin.name);
        console.log('⚡ Admin:', '✓ Yes');
        console.log('═══════════════════════════════════');
        console.log('\n🎯 You can now login and access admin panel');
        console.log('🔗 Admin Panel: http://localhost:3000/admin\n');
      } else {
        console.log('\n✅ User is already an admin!\n');
        console.log('═══════════════════════════════════');
        console.log('📧 Email:', existingAdmin.email);
        console.log('👤 Name:', existingAdmin.name);
        console.log('⚡ Admin:', '✓ Yes');
        console.log('═══════════════════════════════════');
        console.log('\n🎯 Login to access admin panel');
        console.log('🔗 Admin Panel: http://localhost:3000/admin\n');
      }
      
      mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      phone: adminData.phone,
      isAdmin: true,
      isEnrolled: false
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Name:', adminData.name);
    console.log('📱 Phone:', adminData.phone);
    console.log('⚡ Admin:', '✓ Yes');
    console.log('═══════════════════════════════════');
    console.log('\n🎯 You can now login with these credentials');
    console.log('🔗 Admin Panel: http://localhost:3000/admin\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createAdminUser();

