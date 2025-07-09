
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a default school
  const school = await prisma.school.upsert({
    where: { domain: 'edrac.edu' },
    update: {},
    create: {
      name: 'EDRAC School',
      domain: 'edrac.edu'
    }
  });

  console.log('🏫 School created:', school.name);

  // Hash password for all test accounts
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test users
  const users = [
    {
      email: 'admin@edrac.edu',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
      schoolId: school.id
    },
    {
      email: 'superadmin@edrac.edu',
      name: 'Super Administrator',
      password: hashedPassword,
      role: 'SUPERADMIN',
      schoolId: school.id
    },
    {
      email: 'teacher@edrac.edu',
      name: 'John Teacher',
      password: hashedPassword,
      role: 'TEACHER',
      schoolId: school.id
    },
    {
      email: 'student@edrac.edu',
      name: 'Jane Student',
      password: hashedPassword,
      role: 'STUDENT',
      schoolId: school.id
    },
    {
      email: 'parent@edrac.edu',
      name: 'Robert Parent',
      password: hashedPassword,
      role: 'PARENT',
      schoolId: school.id
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    });
    console.log(`👤 User created: ${user.name} (${user.role})`);

    // Create role-specific records
    if (user.role === 'TEACHER') {
      await prisma.staff.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          schoolId: school.id,
          role: 'Teacher',
          department: 'General Studies'
        }
      });
    }

    if (user.role === 'STUDENT') {
      const student = await prisma.student.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          schoolId: school.id
        }
      });

      // Create some sample gamification data
      const gamification = await prisma.gamification.findFirst({
        where: { studentId: student.id }
      });
      
      if (!gamification) {
        await prisma.gamification.create({
          data: {
            studentId: student.id,
            points: 150,
            level: 2,
            badges: JSON.stringify(['First Login', 'Assignment Completed'])
          }
        });
      }
    }

    if (user.role === 'PARENT') {
      await prisma.parent.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          schoolId: school.id
        }
      });
    }
  }

  // Create sample CBT subjects
  const subjects = [
    { name: 'Mathematics' },
    { name: 'English' },
    { name: 'Science' },
    { name: 'History' }
  ];

  for (const subjectData of subjects) {
    let subject = await prisma.cbtSubject.findFirst({
      where: { name: subjectData.name },
    });

    if (!subject) {
      subject = await prisma.cbtSubject.create({
        data: subjectData,
      });
    }

    // Create sample questions for each subject
    const sampleQuestions = [
      {
        text: `What is the fundamental concept in ${subject.name}?`,
        options: JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']),
        answer: 'Option A',
        marks: 1,
        explanation: `This is a basic question about ${subject.name}`
      },
      {
        text: `Advanced topic in ${subject.name}?`,
        options: JSON.stringify(['Advanced A', 'Advanced B', 'Advanced C', 'Advanced D']),
        answer: 'Advanced B',
        marks: 2,
        explanation: `This covers advanced concepts in ${subject.name}`
      }
    ];

    for (const questionData of sampleQuestions) {
      await prisma.cbtQuestion.create({
        data: {
          ...questionData,
          subjectId: subject.id
        }
      });
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
