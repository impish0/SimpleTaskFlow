import express from 'express'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Initialize SQLite database
const dbPath = path.resolve(__dirname, '../database/progress.db')
const db = new Database(dbPath)

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    completed_at DATETIME,
    code_snapshot TEXT,
    git_commit TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learning_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_end DATETIME,
    steps_completed INTEGER DEFAULT 0,
    errors_encountered INTEGER DEFAULT 0,
    help_requests INTEGER DEFAULT 0,
    code_lines_written INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS git_commits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commit_hash TEXT UNIQUE,
    commit_message TEXT,
    files_changed TEXT,
    step_context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// Get current progress
router.get('/current', async (req, res) => {
  try {
    const progress = db.prepare(`
      SELECT * FROM user_progress 
      ORDER BY created_at DESC 
      LIMIT 1
    `).get()
    
    const sessionStats = db.prepare(`
      SELECT 
        COUNT(*) as total_steps,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_steps
      FROM user_progress
    `).get()
    
    res.json({
      currentProgress: progress,
      stats: sessionStats
    })
  } catch (error) {
    console.error('Error getting progress:', error)
    res.status(500).json({ error: 'Failed to get progress' })
  }
})

// Update step progress
router.post('/step', async (req, res) => {
  try {
    const { moduleId, stepId, status, codeSnapshot, gitCommit } = req.body
    
    if (!moduleId || !stepId || !status) {
      return res.status(400).json({ error: 'Module ID, step ID, and status required' })
    }
    
    const now = new Date().toISOString()
    
    // Check if step already exists
    const existing = db.prepare(`
      SELECT id FROM user_progress 
      WHERE module_id = ? AND step_id = ?
    `).get(moduleId, stepId)
    
    if (existing) {
      // Update existing step
      db.prepare(`
        UPDATE user_progress 
        SET status = ?, 
            completed_at = ?,
            code_snapshot = ?,
            git_commit = ?,
            updated_at = ?
        WHERE module_id = ? AND step_id = ?
      `).run(
        status,
        status === 'completed' ? now : null,
        codeSnapshot || null,
        gitCommit || null,
        now,
        moduleId,
        stepId
      )
    } else {
      // Insert new step
      db.prepare(`
        INSERT INTO user_progress (
          module_id, step_id, status, completed_at, 
          code_snapshot, git_commit
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        moduleId,
        stepId,
        status,
        status === 'completed' ? now : null,
        codeSnapshot || null,
        gitCommit || null
      )
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error updating progress:', error)
    res.status(500).json({ error: 'Failed to update progress' })
  }
})

// Record git commit
router.post('/git-commit', async (req, res) => {
  try {
    const { commitHash, commitMessage, filesChanged, stepContext } = req.body
    
    if (!commitHash || !commitMessage) {
      return res.status(400).json({ error: 'Commit hash and message required' })
    }
    
    db.prepare(`
      INSERT OR IGNORE INTO git_commits (
        commit_hash, commit_message, files_changed, step_context
      ) VALUES (?, ?, ?, ?)
    `).run(
      commitHash,
      commitMessage,
      JSON.stringify(filesChanged || []),
      stepContext || null
    )
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error recording git commit:', error)
    res.status(500).json({ error: 'Failed to record git commit' })
  }
})

// Get learning statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_steps,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_steps,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_steps,
        COUNT(DISTINCT module_id) as modules_started
      FROM user_progress
    `).get()
    
    const recentCommits = db.prepare(`
      SELECT * FROM git_commits 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all()
    
    res.json({
      progress: stats,
      recentCommits
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

export { router as progressRoutes }