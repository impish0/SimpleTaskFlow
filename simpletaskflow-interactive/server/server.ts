import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'

// File operation routes
import { fileRoutes } from './routes/files.js'
import { terminalRoutes } from './routes/terminal.js'
import { progressRoutes } from './routes/progress.js'
import { projectRoutes } from './routes/project.js'
import { devServerRoutes } from './routes/devServer.js'

// Services
import { FileWatcher } from './services/fileWatcher.js'
import { ProjectManager } from './services/projectManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// API Routes
app.use('/api/files', fileRoutes)
app.use('/api/terminal', terminalRoutes)  
app.use('/api/progress', progressRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/dev-server', devServerRoutes)

// Initialize services
const projectManager = new ProjectManager()
const fileWatcher = new FileWatcher()

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected')
  
  // Send file changes to client (disabled to prevent page refresh on save)
  // fileWatcher.on('fileChanged', (data) => {
  //   ws.send(JSON.stringify({
  //     type: 'fileChanged',
  //     data
  //   }))
  // })
  
  // Send terminal output to client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      
      if (data.type === 'terminal') {
        // Handle terminal commands
        console.log('Terminal command:', data.command)
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  })
  
  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    workspace: path.resolve(__dirname, '../student-workspace')
  })
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Learning Platform Backend running on http://localhost:${PORT}`)
  console.log(`📁 Student workspace: ${path.resolve(__dirname, '../student-workspace')}`)
})

export { app, wss }