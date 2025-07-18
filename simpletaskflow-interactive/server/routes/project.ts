import express from 'express'
import { ProjectManager } from '../services/projectManager.js'

const router = express.Router()
const projectManager = new ProjectManager()

// Initialize student project
router.post('/init', async (req, res) => {
  try {
    const result = await projectManager.initializeProject()
    res.json(result)
  } catch (error) {
    console.error('Project initialization error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initialize project',
      error: error.message
    })
  }
})

// Get project status
router.get('/status', async (req, res) => {
  try {
    const status = await projectManager.getProjectStatus()
    res.json(status)
  } catch (error) {
    console.error('Project status error:', error)
    res.status(500).json({
      exists: false,
      hasGit: false,
      hasNodeModules: false,
      error: error.message
    })
  }
})

export { router as projectRoutes }