// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({}); // bersihin dulu
  await prisma.user.createMany({
    data: [
      { name: 'Admin User', username: 'admin', password: 'password', role: 'admin' },
      { name: 'Cashier User', username: 'cashier', password: 'password', role: 'cashier' },
    ],
  });
  console.log('✅ Users seeded with role');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
