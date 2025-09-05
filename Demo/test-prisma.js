// test-prisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Attempting to connect to the database with Prisma...');
  await prisma.$connect();
  console.log('✅ Prisma connected successfully!');
}

main()
  .catch(e => {
    console.error('❌ An error occurred while connecting with Prisma:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });