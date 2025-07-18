import chokidar from 'chokidar'
import path from 'path'
import { fileURLToPath } from 'url'
import { EventEmitter } from 'events'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class FileWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null
  private watchPath: string

  constructor() {
    super()
    this.watchPath = path.resolve(__dirname, '../../student-workspace/my-task-manager')
    this.startWatching()
  }

  private async startWatching() {
    try {
      // Ensure the watch directory exists
      await fs.mkdir(this.watchPath, { recursive: true })

      this.watcher = chokidar.watch(this.watchPath, {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/*.log',
          '**/tmp/**'
        ],
        persistent: true,
        ignoreInitial: true
      })

      this.watcher
        .on('add', (filePath) => {
          this.handleFileChange('add', filePath)
        })
        .on('change', (filePath) => {
          this.handleFileChange('change', filePath)
        })
        .on('unlink', (filePath) => {
          this.handleFileChange('delete', filePath)
        })
        .on('addDir', (dirPath) => {
          this.handleFileChange('addDir', dirPath)
        })
        .on('unlinkDir', (dirPath) => {
          this.handleFileChange('deleteDir', dirPath)
        })
        .on('error', (error) => {
          console.error('File watcher error:', error)
        })

      console.log(`📁 Watching student workspace: ${this.watchPath}`)
    } catch (error) {
      console.error('Failed to start file watcher:', error)
    }
  }

  private async handleFileChange(event: string, filePath: string) {
    try {
      const relativePath = path.relative(this.watchPath, filePath)
      
      // Skip if file is outside our watch path
      if (relativePath.startsWith('..')) {
        return
      }

      let content = null
      let stats = null

      if (event !== 'delete' && event !== 'deleteDir') {
        try {
          const fileStats = await fs.stat(filePath)
          if (fileStats.isFile()) {
            content = await fs.readFile(filePath, 'utf-8')
          }
          stats = {
            size: fileStats.size,
            modified: fileStats.mtime,
            isDirectory: fileStats.isDirectory()
          }
        } catch (error) {
          // File might have been deleted between events
          console.warn('Could not read file:', filePath, error.message)
        }
      }

      const changeData = {
        event,
        filePath: relativePath,
        fullPath: filePath,
        content,
        stats,
        timestamp: new Date().toISOString()
      }

      // Emit the change event
      this.emit('fileChanged', changeData)

      // Log the change for debugging
      console.log(`📝 File ${event}: ${relativePath}`)
    } catch (error) {
      console.error('Error handling file change:', error)
    }
  }

  public async getFileTree(): Promise<any[]> {
    try {
      const buildTree = async (dirPath: string): Promise<any[]> => {
        const items = await fs.readdir(dirPath, { withFileTypes: true })
        const tree = []

        for (const item of items) {
          const fullPath = path.join(dirPath, item.name)
          const relativePath = path.relative(this.watchPath, fullPath)

          // Skip ignored files/folders
          if (this.shouldIgnore(item.name)) {
            continue
          }

          if (item.isDirectory()) {
            tree.push({
              name: item.name,
              type: 'directory',
              path: relativePath,
              children: await buildTree(fullPath)
            })
          } else {
            tree.push({
              name: item.name,
              type: 'file',
              path: relativePath,
              size: (await fs.stat(fullPath)).size
            })
          }
        }

        return tree.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })
      }

      return await buildTree(this.watchPath)
    } catch (error) {
      console.error('Error building file tree:', error)
      return []
    }
  }

  private shouldIgnore(name: string): boolean {
    const ignoredPatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.DS_Store',
      'Thumbs.db',
      '.env',
      '*.log'
    ]

    return ignoredPatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(name)
      }
      return name === pattern
    })
  }

  public stop() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
      console.log('File watcher stopped')
    }
  }
}