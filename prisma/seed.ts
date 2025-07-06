import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Create admin
  await prisma.user.upsert({
    where: { email: 'admin@edrac.edu' },
    update: {},
    create: {
      email: 'admin@edrac.edu',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  // Create teacher
  await prisma.user.upsert({
    where: { email: 'teacher@edrac.edu' },
    update: {},
    create: {
      email: 'teacher@edrac.edu',
      name: 'Teacher User',
      password,
      role: 'TEACHER',
    },
  });

  // Create student
  await prisma.user.upsert({
    where: { email: 'student@edrac.edu' },
    update: {},
    create: {
      email: 'student@edrac.edu',
      name: 'Student User',
      password,
      role: 'STUDENT',
    },
  });

  // Create parent
  await prisma.user.upsert({
    where: { email: 'parent@edrac.edu' },
    update: {},
    create: {
      email: 'parent@edrac.edu',
      name: 'Parent User',
      password,
      role: 'PARENT',
    },
  });

  // Create superadmin
  await prisma.user.upsert({
    where: { email: 'superadmin@edrac.edu' },
    update: {},
    create: {
      email: 'superadmin@edrac.edu',
      name: 'Super Admin',
      password,
      role: 'SUPERADMIN',
    },
  });

  console.log('Default users seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
