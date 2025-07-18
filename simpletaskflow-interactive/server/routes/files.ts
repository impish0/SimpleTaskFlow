import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { FileWatcher } from '../services/fileWatcher.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const fileWatcher = new FileWatcher()

// Get the student workspace path
const getWorkspacePath = (projectPath: string = '') => {
  return path.resolve(__dirname, '../../student-workspace/my-task-manager', projectPath)
}

// Get file tree
router.get('/tree', async (req, res) => {
  try {
    const tree = await fileWatcher.getFileTree()
    res.json(tree)
  } catch (error) {
    console.error('Error getting file tree:', error)
    res.status(500).json({ error: 'Failed to get file tree' })
  }
})

// Read file content (GET)
router.get('/', async (req, res) => {
  try {
    const { path: filePath } = req.query
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath as string)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    const content = await fs.readFile(fullPath, 'utf-8')
    res.set('Content-Type', 'text/plain')
    res.send(content)
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(500).json({ error: 'Failed to read file' })
  }
})

// Update file content (PUT)
router.put('/', async (req, res) => {
  try {
    const { path: filePath, content } = req.body
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'File path and content required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf-8')
    
    res.json({ success: true, path: filePath })
  } catch (error) {
    console.error('Error updating file:', error)
    res.status(500).json({ error: 'Failed to update file' })
  }
})

// Create file (POST)
router.post('/', async (req, res) => {
  try {
    const { path: filePath, content = '' } = req.body
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Check if file already exists
    try {
      await fs.access(fullPath)
      return res.status(409).json({ error: 'File already exists' })
    } catch {
      // File doesn't exist, which is what we want
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    
    // Create file
    await fs.writeFile(fullPath, content, 'utf-8')
    
    res.json({ success: true, path: filePath })
  } catch (error) {
    console.error('Error creating file:', error)
    res.status(500).json({ error: 'Failed to create file' })
  }
})

// Delete file (DELETE)
router.delete('/', async (req, res) => {
  try {
    const { path: filePath } = req.body
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    await fs.unlink(fullPath)
    
    res.json({ success: true, path: filePath })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

// List files in student project
router.get('/list', async (req, res) => {
  try {
    const { dir = '' } = req.query
    const fullPath = getWorkspacePath(dir as string)
    
    // Ensure we're within the workspace
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    const items = await fs.readdir(fullPath, { withFileTypes: true })
    const files = items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'directory' : 'file',
      path: path.join(dir as string, item.name)
    }))
    
    res.json({ files })
  } catch (error) {
    console.error('Error listing files:', error)
    res.status(500).json({ error: 'Failed to list files' })
  }
})

// Read file content
router.get('/read', async (req, res) => {
  try {
    const { filePath } = req.query
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath as string)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    const content = await fs.readFile(fullPath, 'utf-8')
    res.json({ content, filePath })
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(500).json({ error: 'Failed to read file' })
  }
})

// Write file content
router.post('/write', async (req, res) => {
  try {
    const { filePath, content } = req.body
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'File path and content required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf-8')
    
    res.json({ success: true, filePath })
  } catch (error) {
    console.error('Error writing file:', error)
    res.status(500).json({ error: 'Failed to write file' })
  }
})

// Create new file
router.post('/create', async (req, res) => {
  try {
    const { filePath, content = '' } = req.body
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Check if file already exists
    try {
      await fs.access(fullPath)
      return res.status(409).json({ error: 'File already exists' })
    } catch {
      // File doesn't exist, which is what we want
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    
    // Create file
    await fs.writeFile(fullPath, content, 'utf-8')
    
    res.json({ success: true, filePath })
  } catch (error) {
    console.error('Error creating file:', error)
    res.status(500).json({ error: 'Failed to create file' })
  }
})

// Delete file
router.delete('/delete', async (req, res) => {
  try {
    const { filePath } = req.body
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' })
    }
    
    const fullPath = getWorkspacePath(filePath)
    
    // Security check
    if (!fullPath.includes('student-workspace/my-task-manager')) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    await fs.unlink(fullPath)
    
    res.json({ success: true, filePath })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

export { router as fileRoutes }