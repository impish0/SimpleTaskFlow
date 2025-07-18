import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class ProjectManager {
  private workspacePath: string

  constructor() {
    this.workspacePath = path.resolve(__dirname, '../../student-workspace')
  }

  async initializeProject(): Promise<{ success: boolean; message: string }> {
    try {
      const projectPath = path.join(this.workspacePath, 'my-task-manager')
      
      // Check if project already exists
      try {
        await fs.access(projectPath)
        return { success: true, message: 'Project already exists' }
      } catch {
        // Project doesn't exist, create it
      }

      // Ensure workspace directory exists
      await fs.mkdir(this.workspacePath, { recursive: true })

      // Create the project using Vite
      console.log('Creating React + TypeScript project...')
      
      const createResult = await this.executeCommand(
        'npm create vite@latest my-task-manager -- --template react-ts',
        this.workspacePath
      )

      if (!createResult.success) {
        throw new Error(`Failed to create project: ${createResult.stderr}`)
      }

      // Install dependencies
      console.log('Installing dependencies...')
      const installResult = await this.executeCommand(
        'npm install',
        projectPath
      )

      if (!installResult.success) {
        throw new Error(`Failed to install dependencies: ${installResult.stderr}`)
      }

      // Install additional dependencies we need for the task manager
      console.log('Installing additional dependencies...')
      const additionalDeps = [
        'lucide-react',
        'clsx',
        'tailwind-merge',
        '@tailwindcss/typography'
      ]

      const depsResult = await this.executeCommand(
        `npm install ${additionalDeps.join(' ')}`,
        projectPath
      )

      if (!depsResult.success) {
        console.warn('Some additional dependencies failed to install:', depsResult.stderr)
      }

      // Initialize git repository
      console.log('Initializing git repository...')
      await this.executeCommand('git init', projectPath)
      await this.executeCommand('git add .', projectPath)
      await this.executeCommand('git commit -m "Initial commit: Create React app"', projectPath)

      // Create initial project structure
      await this.createInitialStructure(projectPath)
      
      // Update Vite config for correct port
      await this.updateViteConfig(projectPath)

      return { 
        success: true, 
        message: 'Project initialized successfully' 
      }
    } catch (error) {
      console.error('Error initializing project:', error)
      return { 
        success: false, 
        message: error.message || 'Failed to initialize project' 
      }
    }
  }

  private async createInitialStructure(projectPath: string) {
    // Create components directory
    const componentsPath = path.join(projectPath, 'src', 'components')
    await fs.mkdir(componentsPath, { recursive: true })

    // Create a simple initial App.tsx that students will modify
    const appContent = `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>My Task Manager</h1>
      <p>Welcome to your task management app!</p>
      <div>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>
      <p>
        Ready to start building? Your AI tutor will guide you step by step!
      </p>
    </div>
  )
}

export default App`

    await fs.writeFile(
      path.join(projectPath, 'src', 'App.tsx'),
      appContent
    )

    // Update App.css with basic styling
    const cssContent = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.App {
  padding: 20px;
}

button {
  border-radius: 8px;
  border: 1px solid #646cff;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #535bf2;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}`

    await fs.writeFile(
      path.join(projectPath, 'src', 'App.css'),
      cssContent
    )

    // Create a README with learning objectives
    const readmeContent = `# My Task Manager

This is your personal task management application that you're building as part of the SimpleTaskFlow Interactive course.

## What You'll Build

- [ ] Task creation and editing
- [ ] Task completion tracking
- [ ] Task filtering and search
- [ ] Local storage persistence
- [ ] Beautiful, responsive UI

## Getting Started

Your AI tutor will guide you through each step of building this application.

## Development Commands

\`\`\`bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Check code quality
\`\`\`

Happy coding! 🚀`

    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      readmeContent
    )

    // Commit the initial structure
    await this.executeCommand('git add .', projectPath)
    await this.executeCommand('git commit -m "Add initial project structure"', projectPath)
  }

  private async updateViteConfig(projectPath: string) {
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    strictPort: true
  }
})
`

    await fs.writeFile(
      path.join(projectPath, 'vite.config.ts'),
      viteConfigContent
    )
  }

  private executeCommand(command: string, cwd: string): Promise<{
    success: boolean
    stdout: string
    stderr: string
    exitCode: number
  }> {
    return new Promise((resolve) => {
      const [cmd, ...args] = command.split(' ')
      const child = spawn(cmd, args, { cwd, shell: true })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0
        })
      })

      child.on('error', (error) => {
        resolve({
          success: false,
          stdout: '',
          stderr: error.message,
          exitCode: 1
        })
      })
    })
  }

  async getProjectStatus(): Promise<{
    exists: boolean
    hasGit: boolean
    hasNodeModules: boolean
    packageJson?: any
  }> {
    try {
      const projectPath = path.join(this.workspacePath, 'my-task-manager')
      
      // Check if project exists
      let exists = false
      try {
        await fs.access(projectPath)
        exists = true
      } catch {
        return { exists: false, hasGit: false, hasNodeModules: false }
      }

      // Check for git
      let hasGit = false
      try {
        await fs.access(path.join(projectPath, '.git'))
        hasGit = true
      } catch {}

      // Check for node_modules
      let hasNodeModules = false
      try {
        await fs.access(path.join(projectPath, 'node_modules'))
        hasNodeModules = true
      } catch {}

      // Read package.json
      let packageJson = null
      try {
        const packageContent = await fs.readFile(
          path.join(projectPath, 'package.json'),
          'utf-8'
        )
        packageJson = JSON.parse(packageContent)
      } catch {}

      return {
        exists,
        hasGit,
        hasNodeModules,
        packageJson
      }
    } catch (error) {
      console.error('Error checking project status:', error)
      return { exists: false, hasGit: false, hasNodeModules: false }
    }
  }
}