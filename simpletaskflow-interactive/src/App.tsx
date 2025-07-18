import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { CodeEditor } from '@/components/editor/code-editor'
import { ThemeProvider } from '@/components/theme-provider'
import { WelcomeOverlay } from '@/components/onboarding/welcome-overlay'
import { useFileStore } from '@/stores/fileStore'

function App() {
  const [showWelcome, setShowWelcome] = useState(false)
  const { setProjectStatus, setFileTree, setDevServerStatus } = useFileStore()

  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem('simpletaskflow-welcome-seen')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
    
    // Initialize project status and file tree
    initializeProject()
  }, [])

  const initializeProject = async () => {
    try {
      // Check project status
      const statusResponse = await fetch('/api/project/status')
      if (statusResponse.ok) {
        const status = await statusResponse.json()
        setProjectStatus(status)
        
        // If project exists, load file tree and dev server status
        if (status.exists) {
          const treeResponse = await fetch('/api/files/tree')
          if (treeResponse.ok) {
            const tree = await treeResponse.json()
            setFileTree(tree)
          }
          
          // Check dev server status
          const devServerResponse = await fetch('/api/dev-server/status')
          if (devServerResponse.ok) {
            const devStatus = await devServerResponse.json()
            setDevServerStatus(devStatus)
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize project:', error)
    }
  }

  const handleStartLearning = async () => {
    localStorage.setItem('simpletaskflow-welcome-seen', 'true')
    setShowWelcome(false)
    
    // Initialize student project if it doesn't exist
    try {
      const response = await fetch('/api/project/init', { method: 'POST' })
      if (response.ok) {
        const result = await response.json()
        console.log('Project initialization:', result.message)
        // Refresh project status and file tree
        await initializeProject()
      }
    } catch (error) {
      console.error('Failed to initialize student project:', error)
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppLayout>
        <CodeEditor 
          onChange={(value) => {
            console.log('Code changed:', value)
          }}
        />
      </AppLayout>
      
      {showWelcome && (
        <WelcomeOverlay onStart={handleStartLearning} />
      )}
    </ThemeProvider>
  )
}

export default App
