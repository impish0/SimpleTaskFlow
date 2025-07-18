import express from 'express'
import { DevServerManager } from '../services/devServerManager.js'

const router = express.Router()
const devServerManager = new DevServerManager()

// Start dev server
router.post('/start', async (req, res) => {
  try {
    const result = await devServerManager.start()
    res.json(result)
  } catch (error) {
    console.error('Dev server start error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start dev server',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Stop dev server
router.post('/stop', async (req, res) => {
  try {
    const result = await devServerManager.stop()
    res.json(result)
  } catch (error) {
    console.error('Dev server stop error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to stop dev server',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Restart dev server
router.post('/restart', async (req, res) => {
  try {
    const result = await devServerManager.restart()
    res.json(result)
  } catch (error) {
    console.error('Dev server restart error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to restart dev server',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get dev server status
router.get('/status', (req, res) => {
  try {
    const status = devServerManager.getStatus()
    res.json(status)
  } catch (error) {
    console.error('Dev server status error:', error)
    res.status(500).json({
      isRunning: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// WebSocket events for real-time updates
devServerManager.on('ready', (data) => {
  console.log('Dev server ready:', data)
})

devServerManager.on('output', (data) => {
  console.log('Dev server output:', data)
})

devServerManager.on('exit', (data) => {
  console.log('Dev server exited:', data)
})

devServerManager.on('error', (data) => {
  console.error('Dev server error:', data)
})

// Cleanup on process exit
process.on('exit', () => {
  devServerManager.cleanup()
})

process.on('SIGINT', () => {
  devServerManager.cleanup()
  process.exit()
})

export { router as devServerRoutes, devServerManager }