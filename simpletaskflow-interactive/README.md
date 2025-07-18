# SimpleTaskFlow Interactive 🚀

An interactive learning platform that teaches complete beginners how to build a full-stack React + Node.js task manager application through hands-on coding with real-time AI tutoring.

## ✨ Features

### 🎯 Real Development Environment
- **Monaco Editor** - Professional code editor (VS Code engine)
- **Live File System** - Work with actual files on disk, not simulations
- **Real Terminal** - Execute real npm, git, and other commands
- **Live Preview** - See your React app running in real-time
- **Git Integration** - Learn version control with actual git repositories

### 🤖 AI-Powered Learning
- **Contextual AI Tutor** - Claude provides help based on your current code
- **Step-by-Step Guidance** - Follow structured curriculum modules
- **Real-time Feedback** - Get instant help when stuck
- **Progress Tracking** - Track your learning journey

### 💻 Professional IDE Experience
- **Three-Panel Layout** - Curriculum, Editor, AI Tutor
- **File Tree Navigation** - Browse your project structure
- **Syntax Highlighting** - Full language support
- **Dark/Light Themes** - Comfortable coding experience
- **Collapsible Panels** - Maximize screen space

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/simpletaskflow-interactive.git
cd simpletaskflow-interactive
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the backend server**
```bash
npm run dev:server
```

4. **Start the frontend (in a new terminal)**
```bash
npm run dev
```

5. **Open your browser**
Navigate to http://localhost:3000

## 🎓 How It Works

1. **Welcome Screen** - Click "Start Learning Now!" to create your project
2. **File Explorer** - Browse and select files from your project
3. **Code Editor** - Write and edit your React components
4. **Save & Run** - Save changes and see them live in the preview
5. **AI Tutor** - Ask questions and get contextual help

## 🏗️ Architecture

```
SimpleTaskFlow Interactive
├── Frontend (React + TypeScript + Vite)
│   ├── Monaco Editor integration
│   ├── Real-time file management
│   ├── Live preview system
│   └── AI tutor interface
├── Backend (Express + TypeScript)
│   ├── File operations API
│   ├── Dev server management
│   ├── Terminal command execution
│   └── Progress tracking
└── Student Workspace
    └── my-task-manager (Generated React project)
```

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- shadcn/ui components
- Monaco Editor
- Zustand (state management)

### Backend
- Node.js + Express
- TypeScript
- SQLite (progress tracking)
- WebSocket (real-time updates)
- Chokidar (file watching)

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI tutor instructions and technical architecture
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Development roadmap

## 🔧 Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run init-project` - Initialize student project

### API Endpoints

- `GET /api/project/status` - Check project status
- `POST /api/project/init` - Initialize student project
- `GET /api/files` - Read file content
- `PUT /api/files` - Save file content
- `POST /api/dev-server/start` - Start preview server
- `POST /api/dev-server/stop` - Stop preview server

## 🚧 Roadmap

### Completed ✅
- [x] Core IDE interface
- [x] Monaco Editor integration
- [x] File tree navigation
- [x] Live preview system
- [x] Save/Reset functionality
- [x] Theme switching
- [x] Responsive layout

### In Progress 🔄
- [ ] Terminal integration
- [ ] AI tutor chat system
- [ ] Curriculum content

### Planned 📋
- [ ] Step verification system
- [ ] Progress persistence
- [ ] Multi-file editing
- [ ] Git UI integration
- [ ] Test runner integration
- [ ] Collaborative features

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Claude's assistance
- Inspired by modern coding education platforms
- Uses the excellent Monaco Editor from Microsoft