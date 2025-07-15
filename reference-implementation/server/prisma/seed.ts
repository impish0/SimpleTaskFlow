import { PrismaClient, Category, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.task.deleteMany();
  console.log('Cleared existing tasks');

  // Create sample tasks
  const tasks = [
    {
      title: "Complete project proposal",
      description: "Finish the Q4 project proposal for the client meeting",
      category: Category.WORK,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      completed: false
    },
    {
      title: "Buy groceries",
      description: "Milk, bread, eggs, vegetables for the week",
      category: Category.SHOPPING,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      completed: false
    },
    {
      title: "Morning run",
      description: "30-minute jog in the park",
      category: Category.HEALTH,
      priority: Priority.LOW,
      dueDate: new Date(), // today
      completed: true
    },
    {
      title: "Call mom",
      description: "Check in and see how she's doing",
      category: Category.PERSONAL,
      priority: Priority.MEDIUM,
      dueDate: null,
      completed: false
    },
    {
      title: "Review team performance",
      description: "Quarterly review for team members",
      category: Category.WORK,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      completed: false
    },
    {
      title: "Book dentist appointment",
      description: "Schedule regular cleaning appointment",
      category: Category.HEALTH,
      priority: Priority.LOW,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      completed: false
    },
    {
      title: "Finish reading book",
      description: "Complete 'The Pragmatic Programmer'",
      category: Category.PERSONAL,
      priority: Priority.LOW,
      dueDate: null,
      completed: false
    },
    {
      title: "Update resume",
      description: "Add recent projects and skills",
      category: Category.WORK,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      completed: false
    }
  ];

  // Create tasks in database
  for (const task of tasks) {
    const createdTask = await prisma.task.create({
      data: task
    });
    console.log(`Created task: ${createdTask.title}`);
  }

  console.log('Database seeded successfully!');
  console.log(`Created ${tasks.length} sample tasks`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });