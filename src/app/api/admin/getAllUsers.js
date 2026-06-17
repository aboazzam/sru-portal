const { PrismaClient } = require('../../../generated/prisma');

const prisma = new PrismaClient();

async function getAllUsers() {
  try {
    console.log('🔄 جاري جلب المستخدمين...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log('\n========== ALL USERS ==========\n');
    console.table(users);
    console.log(`\n✅ عدد المستخدمين: ${users.length}\n`);
    
    return users;
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getAllUsers();