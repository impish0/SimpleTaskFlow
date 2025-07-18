import express from 'express'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Get the student workspace path
const getWorkspacePath = () => {
  return path.resolve(__dirname, '../../student-workspace/my-task-manager')
}

// Safe commands that are allowed
const SAFE_COMMANDS = [
  'npm',
  'git',
  'node',
  'ls',
  'dir',
  'pwd',
  'cd',
  'cat',
  'echo',
  'mkdir',
  'touch'
]

// Check if command is safe
const isSafeCommand = (command: string): boolean => {
  const cmd = command.trim().split(' ')[0]
  return SAFE_COMMANDS.includes(cmd)
}

// Execute terminal command
router.post('/execute', async (req, res) => {
  try {
    const { command, workingDir = '' } = req.body
    
    if (!command) {
      return res.status(400).json({ error: 'Command required' })
    }
    
    // Security check
    if (!isSafeCommand(command)) {
      return res.status(403).json({ 
        error: `Command "${command.split(' ')[0]}" not allowed`,
        allowedCommands: SAFE_COMMANDS
      })
    }
    
    const workspace = getWorkspacePath()
    const cwd = path.resolve(workspace, workingDir)
    
    // Ensure we're within the workspace
    if (!cwd.startsWith(workspace)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Parse command
    const [cmd, ...args] = command.trim().split(' ')
    
    // Execute command
    const child = spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    let stdout = ''
    let stderr = ''
    
    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    child.on('close', (code) => {
      res.json({
        command,
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        success: code === 0
      })
    })
    
    child.on('error', (error) => {
      res.status(500).json({
        command,
        error: error.message,
        success: false
      })
    })
    
    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill('SIGTERM')
      res.status(408).json({
        command,
        error: 'Command timeout',
        success: false
      })
    }, 30000)
    
  } catch (error) {
    console.error('Error executing command:', error)
    res.status(500).json({ error: 'Failed to execute command' })
  }
})

// Get working directory
router.get('/pwd', async (req, res) => {
  try {
    const workspace = getWorkspacePath()
    res.json({ 
      pwd: workspace,
      relativePath: 'my-task-manager'
    })
  } catch (error) {
    console.error('Error getting working directory:', error)
    res.status(500).json({ error: 'Failed to get working directory' })
  }
})

export { router as terminalRoutes }