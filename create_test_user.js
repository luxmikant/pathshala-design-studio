const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: Test@123456');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('Test@123456', 12);

      // Create organization first
      const org = await prisma.organization.create({
        data: {
          name: 'Test Organization',
          type: 'NGO',
          state: 'Delhi',
          district: 'Central',
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN',
          organizationId: org.id,
        },
      });

      console.log('✅ Test user created successfully!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: Test@123456');
    }
    
    console.log('\n🌐 You can now login at http://localhost:3002/auth/login');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createTestUser();
