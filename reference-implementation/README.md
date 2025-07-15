# 📱 Reference Implementation - Complete Task Manager

This folder contains the complete, working task manager application. It serves as:
- **Reference code** when you're stuck learning
- **Working example** to see the final result
- **Debugging tool** to compare your code

## 🚀 Quick Start

**Want to see the finished app?** Run these commands:

```bash
# Install all dependencies
npm run setup

# Start both frontend and backend
npm run dev
```

Then open:
- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health

## 📱 What You'll See

A complete task management application with:

- ✅ **Create, edit, and delete tasks**
- 🏷️ **Organize by category** (Work, Personal, Shopping, Health, Other)
- ⚡ **Set priority levels** (High, Medium, Low) and due dates
- ✔️ **Mark tasks as completed** with visual feedback
- 📊 **View statistics** and progress tracking
- 🎨 **Dark/light mode** with auto-detection
- 📋 **List and grid views** with localStorage persistence
- 📱 **Responsive design** for mobile and desktop

## 🏗️ Technical Features

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Custom hooks for state management
- Theme switching with context
- Optimistic UI updates

**Backend:**
- Express.js with TypeScript
- Prisma ORM with SQLite database
- RESTful API design
- Input validation and error handling
- CORS configuration

**Database:**
- SQLite with Prisma schema
- Task model with categories and priorities
- Automatic timestamps
- Sample seed data

## 📁 Project Structure

```
reference-implementation/
├── package.json              # Workspace configuration
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── contexts/        # React contexts (theme)
│   │   ├── api/             # API client
│   │   ├── types/           # TypeScript definitions
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── vite.config.ts
└── server/                   # Express backend
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── routes/          # API routes
    │   ├── middleware/      # Express middleware
    │   ├── types/           # TypeScript definitions
    │   └── utils/           # Helper functions
    ├── prisma/
    │   ├── schema.prisma    # Database schema
    │   └── seed.ts          # Sample data
    └── package.json
```

## 🛠️ Available Scripts

**Root level commands:**
```bash
npm run setup          # Install all dependencies
npm run dev            # Start both frontend and backend
npm run dev:client     # Start only frontend
npm run dev:server     # Start only backend
```

**Backend commands:**
```bash
cd server
npm run dev            # Start development server
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Add sample data
npm run db:reset       # Reset database
```

**Frontend commands:**
```bash
cd client  
npm run dev            # Start development server
npm run build          # Build for production
```

## 🎓 For Learning

### When to Use This Reference

**✅ Good times to check the reference:**
- After completing a module (compare your results)
- When debugging a specific issue  
- To understand how pieces fit together
- To see the final user experience

**❌ Try to avoid:**
- Copying code without understanding
- Skipping the learning modules
- Using this as a shortcut

### How to Use for Debugging

1. **Compare file structure** - Does your project look similar?
2. **Check specific files** - Is your code similar to the reference?
3. **Run the working version** - See how it should behave
4. **Compare error messages** - What's different?

### Understanding the Code

**Key concepts demonstrated:**
- **Component composition** - How UI pieces fit together
- **State management** - Using hooks and context
- **API integration** - Frontend-backend communication  
- **Type safety** - TypeScript throughout
- **Error handling** - Graceful failure management
- **Professional structure** - Organized, maintainable code

## 🔍 Code Highlights

**Custom Hooks:**
- `useTasks` - Complete task management state
- `useViewMode` - Persistent view preferences
- `useTheme` - Dark/light mode switching

**Unified Components:**
- `TaskItem` - Works for both grid and list views
- `ThemeToggle` - System/light/dark mode selector
- `ViewToggle` - Grid/list view switcher

**Professional Patterns:**
- Consistent error handling
- TypeScript for all API calls
- Responsive design principles
- Accessibility considerations

## 🎯 Learning Goals

By studying this reference implementation, you should understand:

1. **How modern React applications are structured**
2. **TypeScript integration throughout the stack**
3. **Professional API design patterns**
4. **Database modeling with Prisma**
5. **Component reusability and composition**
6. **State management without external libraries**
7. **Professional development practices**

---

## 🎓 Back to Learning

**Ready to build your own?** Head back to the student workspace:

```bash
cd ../student-workspace
```

**Continue the curriculum:** Follow the modules step-by-step to build your own version!

Remember: The goal is to understand how to build this yourself, not just copy the reference! 🚀