import { create } from 'zustand'

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  path: string
  size?: number
  children?: FileNode[]
}

interface FileState {
  // Current file being edited
  currentFile: {
    path: string
    content: string
    language: string
    modified: boolean
  } | null
  
  // File tree structure
  fileTree: FileNode[]
  
  // Project status
  projectStatus: {
    exists: boolean
    hasGit: boolean
    hasNodeModules: boolean
    packageJson?: any
  }
  
  // Dev server status
  devServerStatus: {
    isRunning: boolean
    port?: number
  }
  
  // Actions
  setCurrentFile: (path: string, content: string, language: string) => void
  updateFileContent: (content: string) => void
  markFileModified: (modified: boolean) => void
  setFileTree: (tree: FileNode[]) => void
  setProjectStatus: (status: any) => void
  setDevServerStatus: (status: any) => void
  
  // File operations
  saveCurrentFile: () => Promise<boolean>
  loadFile: (path: string) => Promise<void>
  createFile: (path: string, content: string) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  
  // Dev server operations
  startDevServer: () => Promise<boolean>
  stopDevServer: () => Promise<boolean>
  restartDevServer: () => Promise<boolean>
}

export const useFileStore = create<FileState>((set, get) => ({
  currentFile: null,
  fileTree: [],
  projectStatus: {
    exists: false,
    hasGit: false,
    hasNodeModules: false
  },
  devServerStatus: {
    isRunning: false
  },

  setCurrentFile: (path, content, language) => {
    set({
      currentFile: {
        path,
        content,
        language,
        modified: false
      }
    })
  },

  updateFileContent: (content) => {
    const current = get().currentFile
    if (current) {
      set({
        currentFile: {
          ...current,
          content,
          modified: current.content !== content
        }
      })
    }
  },

  markFileModified: (modified) => {
    const current = get().currentFile
    if (current) {
      set({
        currentFile: {
          ...current,
          modified
        }
      })
    }
  },

  setFileTree: (tree) => {
    set({ fileTree: tree })
  },

  setProjectStatus: (status) => {
    set({ projectStatus: status })
  },

  setDevServerStatus: (status) => {
    set({ devServerStatus: status })
  },

  saveCurrentFile: async () => {
    const current = get().currentFile
    if (!current) return false

    try {
      const response = await fetch('/api/files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: current.path,
          content: current.content
        })
      })

      if (response.ok) {
        get().markFileModified(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to save file:', error)
      return false
    }
  },

  loadFile: async (path) => {
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
      if (response.ok) {
        const content = await response.text()
        const language = getLanguageFromPath(path)
        get().setCurrentFile(path, content, language)
      }
    } catch (error) {
      console.error('Failed to load file:', error)
    }
  },

  createFile: async (path, content) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      })
      
      if (response.ok) {
        // Refresh file tree
        await refreshFileTree()
      }
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  },

  deleteFile: async (path) => {
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })
      
      if (response.ok) {
        // Refresh file tree and clear current file if it was deleted
        const current = get().currentFile
        if (current && current.path === path) {
          set({ currentFile: null })
        }
        await refreshFileTree()
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  },

  startDevServer: async () => {
    try {
      const response = await fetch('/api/dev-server/start', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        get().setDevServerStatus({ isRunning: true, port: result.port })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to start dev server:', error)
      return false
    }
  },

  stopDevServer: async () => {
    try {
      const response = await fetch('/api/dev-server/stop', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        get().setDevServerStatus({ isRunning: false })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to stop dev server:', error)
      return false
    }
  },

  restartDevServer: async () => {
    try {
      const response = await fetch('/api/dev-server/restart', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        get().setDevServerStatus({ isRunning: true, port: result.port })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to restart dev server:', error)
      return false
    }
  }
}))

// Helper function to determine language from file extension
function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'text'
  }
}

// Helper function to refresh file tree
async function refreshFileTree() {
  try {
    const response = await fetch('/api/files/tree')
    if (response.ok) {
      const tree = await response.json()
      useFileStore.getState().setFileTree(tree)
    }
  } catch (error) {
    console.error('Failed to refresh file tree:', error)
  }
}