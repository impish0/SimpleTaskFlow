# Module 2: Database Setup with Prisma

**Duration:** 2 days | **Week:** 1

## What You'll Build
By the end of this module, you'll have a working database that can store tasks, complete with a schema that defines what data your tasks can hold.

## Step-by-Step Instructions

### Step 1: Navigate to Server Folder (1 minute)

**Do this:** Open your terminal and make sure you're in your project folder, then go to the server:

```bash
cd my-task-manager
cd server
```

**Verify it worked:** Type `pwd` (Mac/Linux) or `cd` (Windows). You should see your path ends with "my-task-manager/server".

---

### Step 2: Create Server Package.json (3 minutes)

**Do this:** Initialize the server project:

```bash
npm init -y
```

**Then open the file that was created:**
```bash
code package.json
```

**You should see something like:**
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**Replace it with exactly this:**
```json
{
  "name": "task-manager-server",
  "version": "1.0.0",
  "description": "Backend server for task manager",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx src/prisma/seed.ts"
  },
  "keywords": ["express", "prisma", "typescript"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Save the file.**

**What this does:** Sets up scripts to run our server and database commands.

---

### Step 3: Install Backend Dependencies (5 minutes)

**Do this:** Install all the packages we'll need:

```bash
npm install express cors prisma @prisma/client
```

**What you'll see:** Text about downloading packages. This will take 1-2 minutes.

**Then install development dependencies:**
```bash
npm install -D typescript tsx @types/node @types/express @types/cors ts-node
```

**What you'll see:** More text about downloading packages.

**What these packages do:**
- **express**: Web server framework
- **cors**: Allows frontend to talk to backend
- **prisma**: Database toolkit
- **typescript**: Adds types to JavaScript for better code

---

### Step 4: Create TypeScript Configuration (2 minutes)

**Do this:** Create a TypeScript config file:

```bash
touch tsconfig.json
code tsconfig.json
```

**Type exactly this into the file:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Save the file.**

**What this does:** Tells TypeScript how to compile our code.

---

### Step 5: Initialize Prisma (3 minutes)

**Do this:** Set up Prisma for our database:

```bash
npx prisma init --datasource-provider sqlite
```

**What you'll see:** Text about creating files and folders.

**What this creates:**
- `prisma/` folder with database configuration
- `.env` file for environment variables

**Verify it worked:** Type `ls -la` (Mac/Linux) or `dir` (Windows). You should see:
- `prisma/` folder
- `.env` file

---

### Step 6: Create the Database Schema (10 minutes)

**Do this:** Open the schema file that was created:

```bash
code prisma/schema.prisma
```

**You should see something like:**
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Replace it with exactly this:**
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  category    Category  @default(OTHER)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Category {
  WORK
  PERSONAL
  SHOPPING
  HEALTH
  OTHER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

**Save the file.**

**What this defines:**
- **Task model**: The structure of each task
- **id**: Unique number for each task
- **title**: The task name (required)
- **description**: Optional details about the task
- **completed**: Whether it's done (starts as false)
- **category**: Type of task (work, personal, etc.)
- **priority**: How important it is
- **dueDate**: When it's due (optional)
- **createdAt/updatedAt**: When task was made/changed

---

### Step 7: Generate Database Files (2 minutes)

**Do this:** Generate the Prisma client:

```bash
npm run db:generate
```

**What you'll see:** Text about generating files.

**Then push the schema to create the database:**
```bash
npm run db:push
```

**What you'll see:** Text about creating database tables.

**What this does:** Creates the actual database file and generates code to interact with it.

---

### Step 8: Create Folder Structure (2 minutes)

**Do this:** Create the folders we'll need:

```bash
mkdir src
mkdir src/controllers
mkdir src/middleware
mkdir src/routes
mkdir src/types
mkdir src/utils
mkdir src/prisma
```

**Verify it worked:** Type `ls -la src` (Mac/Linux) or `dir src` (Windows). You should see all the folders.

**What each folder will contain:**
- **controllers**: Functions that handle requests
- **middleware**: Code that runs between requests
- **routes**: URL endpoints
- **types**: TypeScript type definitions
- **utils**: Helper functions
- **prisma**: Database utilities

---

### Step 9: Create Database Utility (5 minutes)

**Do this:** Create a file to connect to the database:

```bash
touch src/utils/database.ts
code src/utils/database.ts
```

**Type exactly this:**
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

**Save the file.**

**What this does:** Creates a connection to our database that we can use throughout our app.

---

### Step 10: Create Seed Data (8 minutes)

**Do this:** Create a file to add sample tasks to test with:

```bash
touch src/prisma/seed.ts
code src/prisma/seed.ts
```

**Type exactly this:**
```typescript
import { PrismaClient, Category, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete all existing tasks first
  await prisma.task.deleteMany();

  // Create sample tasks
  const sampleTasks = [
    {
      title: 'Complete project proposal',
      description: 'Finish the Q4 project proposal for the new client',
      category: Category.WORK,
      priority: Priority.HIGH,
      dueDate: new Date('2024-01-15'),
      completed: false,
    },
    {
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, and fruits for the week',
      category: Category.SHOPPING,
      priority: Priority.MEDIUM,
      dueDate: new Date('2024-01-10'),
      completed: false,
    },
    {
      title: 'Exercise routine',
      description: '30 minutes of cardio and strength training',
      category: Category.HEALTH,
      priority: Priority.HIGH,
      dueDate: null,
      completed: false,
    },
    {
      title: 'Call mom',
      description: 'Weekly check-in call with family',
      category: Category.PERSONAL,
      priority: Priority.MEDIUM,
      dueDate: new Date('2024-01-12'),
      completed: true,
    },
    {
      title: 'Read book',
      description: 'Continue reading "The Great Gatsby"',
      category: Category.PERSONAL,
      priority: Priority.LOW,
      dueDate: null,
      completed: false,
    },
    {
      title: 'Team meeting',
      description: 'Weekly sync with development team',
      category: Category.WORK,
      priority: Priority.MEDIUM,
      dueDate: new Date('2024-01-11'),
      completed: true,
    },
  ];

  // Insert sample tasks
  for (const task of sampleTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${sampleTasks.length} sample tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Save the file.**

**What this does:** Creates sample tasks so you have data to work with right away.

---

### Step 11: Run the Seed Script (2 minutes)

**Do this:** Add the sample data to your database:

```bash
npm run db:seed
```

**You should see:**
```
🌱 Seeding database...
✅ Database seeded successfully!
Created 6 sample tasks
```

**If you see an error:** Make sure you're in the server folder and all previous steps worked.

---

### Step 12: Explore Your Database (5 minutes)

**Do this:** Open Prisma Studio to see your data:

```bash
npm run db:studio
```

**What you'll see:** Text about starting Prisma Studio.

**Then:** Open your browser and go to http://localhost:5555

**You should see:** A web interface showing your Task table with 6 sample tasks.

**Explore:** Click on tasks to see their details. Notice the different categories, priorities, and due dates.

**When done:** Press Ctrl+C in the terminal to stop Prisma Studio.

---

### Step 13: Commit Your Work (3 minutes)

**Do this:** Go back to the root folder and save your progress:

```bash
cd ..
git add .
git commit -m "Add database setup with Prisma

- Created server package.json with scripts
- Installed Express, Prisma, and TypeScript dependencies
- Set up Prisma schema with Task model
- Added Category and Priority enums
- Created database utilities and seed data
- Generated database with sample tasks"
```

**Then push to GitHub:**
```bash
git push
```

---

## Completion Checklist

✅ **Server Setup**
- [ ] Server package.json created with correct scripts
- [ ] All dependencies installed (express, prisma, typescript, etc.)
- [ ] TypeScript configuration file created
- [ ] Server folder structure created (src, controllers, etc.)

✅ **Database Configuration**
- [ ] Prisma initialized with SQLite
- [ ] Schema file created with Task model
- [ ] Category and Priority enums defined
- [ ] Database generated (`npm run db:generate` worked)
- [ ] Schema pushed to database (`npm run db:push` worked)

✅ **Database Content**
- [ ] Database utility file created
- [ ] Seed script created with sample tasks
- [ ] Seed script run successfully (6 tasks created)
- [ ] Prisma Studio shows tasks correctly
- [ ] All work committed and pushed to GitHub

✅ **Understanding Check**
- [ ] Can explain what Prisma does
- [ ] Understand what the Task model represents
- [ ] Know what each field in the Task model is for
- [ ] Can explain the difference between required and optional fields
- [ ] Understand what enums are (Category, Priority)

---

## What You Accomplished

🏆 **You built a complete database system!**

You now have:
- **Structured data storage** with SQLite database
- **Type-safe database access** with Prisma
- **Sample data** to test with
- **Database management tools** (Prisma Studio)
- **Professional database schema** with proper relationships

**Next:** In Module 3, you'll create API endpoints that let your frontend read and write tasks to this database.

---

## Troubleshooting

**Problem:** `npx prisma` commands not working
**Solution:** Make sure you're in the server folder and ran `npm install` first.

**Problem:** "Database file not found" errors
**Solution:** Run `npm run db:push` to create the database file.

**Problem:** Seed script fails
**Solution:** Check that the database was created first with `npm run db:push`.

**Problem:** Prisma Studio won't open
**Solution:** Make sure port 5555 isn't being used by another app. Try `npm run db:studio` again.

---

**Need Help?** Ask your Claude tutor about any database concepts you don't understand. The database is the foundation of your app!