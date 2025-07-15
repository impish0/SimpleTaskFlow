import { PrismaClient } from '@prisma/client';

// Create a single Prisma instance that can be used throughout the application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Function to connect to the database
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

// Function to disconnect from the database
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Export the Prisma instance
export { prisma };