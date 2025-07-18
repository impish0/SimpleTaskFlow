import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { EventEmitter } from 'events'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class DevServerManager extends EventEmitter {
  private process: ChildProcess | null = null
  private projectPath: string
  private isRunning: boolean = false
  private port: number = 5174 // Avoid conflict with learning platform on 3000 and backend on 3001

  constructor() {
    super()
    this.projectPath = path.resolve(__dirname, '../../student-workspace/my-task-manager')
  }

  async start(): Promise<{ success: boolean; message: string; port?: number }> {
    if (this.isRunning) {
      return { 
        success: true, 
        message: 'Dev server already running',
        port: this.port 
      }
    }

    try {
      // Start the Vite dev server
      this.process = spawn('npm', ['run', 'dev'], {
        cwd: this.projectPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: {
          ...process.env,
          VITE_PORT: this.port.toString(),
          BROWSER: 'none' // Don't auto-open browser
        }
      })

      if (!this.process) {
        throw new Error('Failed to spawn process')
      }

      // Handle process output
      this.process.stdout?.on('data', (data) => {
        const output = data.toString()
        console.log('Dev server stdout:', output)
        
        // Check if server is ready
        if (output.includes('Local:') || output.includes('ready in')) {
          this.isRunning = true
          this.emit('ready', { port: this.port })
        }
        
        this.emit('output', { type: 'stdout', data: output })
      })

      this.process.stderr?.on('data', (data) => {
        const output = data.toString()
        console.log('Dev server stderr:', output)
        this.emit('output', { type: 'stderr', data: output })
      })

      this.process.on('close', (code) => {
        console.log(`Dev server process exited with code ${code}`)
        this.isRunning = false
        this.process = null
        this.emit('exit', { code })
      })

      this.process.on('error', (error) => {
        console.error('Dev server process error:', error)
        this.isRunning = false
        this.process = null
        this.emit('error', { error: error.message })
      })

      // Wait a moment for server to start
      await this.waitForServer()

      return {
        success: true,
        message: 'Dev server started successfully',
        port: this.port
      }
    } catch (error) {
      console.error('Failed to start dev server:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start dev server'
      }
    }
  }

  async stop(): Promise<{ success: boolean; message: string }> {
    if (!this.isRunning || !this.process) {
      return {
        success: true,
        message: 'Dev server not running'
      }
    }

    try {
      // Gracefully terminate the process
      this.process.kill('SIGTERM')
      
      // Wait for process to exit
      await new Promise((resolve) => {
        if (this.process) {
          this.process.on('close', resolve)
          // Force kill after 5 seconds if graceful shutdown fails
          setTimeout(() => {
            if (this.process && this.isRunning) {
              this.process.kill('SIGKILL')
            }
            resolve(undefined)
          }, 5000)
        } else {
          resolve(undefined)
        }
      })

      this.isRunning = false
      this.process = null

      return {
        success: true,
        message: 'Dev server stopped successfully'
      }
    } catch (error) {
      console.error('Failed to stop dev server:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to stop dev server'
      }
    }
  }

  async restart(): Promise<{ success: boolean; message: string; port?: number }> {
    const stopResult = await this.stop()
    if (!stopResult.success) {
      return stopResult
    }

    // Wait a moment before restarting
    await new Promise(resolve => setTimeout(resolve, 1000))

    return await this.start()
  }

  getStatus(): { isRunning: boolean; port?: number } {
    return {
      isRunning: this.isRunning,
      port: this.isRunning ? this.port : undefined
    }
  }

  private waitForServer(timeout: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for dev server to start'))
      }, timeout)

      const onReady = () => {
        clearTimeout(timeoutId)
        this.off('ready', onReady)
        this.off('error', onError)
        resolve()
      }

      const onError = (error: any) => {
        clearTimeout(timeoutId)
        this.off('ready', onReady)
        this.off('error', onError)
        reject(new Error(error.error || 'Dev server failed to start'))
      }

      this.once('ready', onReady)
      this.once('error', onError)
    })
  }

  // Clean up on process exit
  cleanup() {
    if (this.isRunning && this.process) {
      this.process.kill('SIGTERM')
    }
  }
}