import * as React from "react"
import { Editor } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Save, File } from "lucide-react"
import { useFileStore } from "@/stores/fileStore"

interface CodeEditorProps {
  defaultValue?: string
  language?: string
  onChange?: (value: string | undefined) => void
}

export function CodeEditor({ onChange }: CodeEditorProps) {
  const { theme, resolvedTheme } = useTheme()
  const { 
    currentFile, 
    updateFileContent, 
    saveCurrentFile, 
    loadFile,
    projectStatus,
    devServerStatus,
    startDevServer,
    stopDevServer
  } = useFileStore()
  
  // Use resolvedTheme to get the actual theme (not 'system')
  const editorTheme = React.useMemo(() => {
    const currentTheme = resolvedTheme || theme
    return currentTheme === 'dark' ? 'vs-dark' : 'vs-light'
  }, [theme, resolvedTheme])

  // Load initial file when component mounts
  React.useEffect(() => {
    if (!currentFile && projectStatus.exists) {
      // Load the main App.tsx file by default
      loadFile('src/App.tsx')
    }
  }, [currentFile, projectStatus.exists, loadFile])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(value)
      onChange?.(value)
    }
  }

  const handleSave = async () => {
    const success = await saveCurrentFile()
    if (success) {
      console.log('File saved successfully!')
    } else {
      console.error('Failed to save file')
    }
  }

  const handleReset = async () => {
    if (currentFile) {
      // Confirm reset action
      if (currentFile.modified) {
        const confirmed = window.confirm('Are you sure you want to reset? All unsaved changes will be lost.')
        if (!confirmed) return
      }
      
      // Reload the file from disk
      await loadFile(currentFile.path)
      console.log('File reset from disk')
    }
  }

  const handleRun = async () => {
    if (devServerStatus.isRunning) {
      // Stop the dev server
      const success = await stopDevServer()
      if (success) {
        console.log('Dev server stopped')
      }
    } else {
      // Start the dev server
      const success = await startDevServer()
      if (success) {
        console.log('Dev server started on port:', devServerStatus.port)
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {currentFile ? currentFile.path : 'No file selected'}
              </CardTitle>
              {currentFile?.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={!currentFile?.modified}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                disabled={!currentFile}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                size="sm" 
                onClick={handleRun}
                disabled={!projectStatus.exists}
                className={devServerStatus.isRunning 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-primary hover:bg-primary/90"
                }
              >
                <Play className="h-4 w-4 mr-2" />
                {devServerStatus.isRunning ? 'Stop' : 'Run'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Monaco Editor */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          <Editor
            height="100%"
            language={currentFile?.language || 'typescript'}
            value={currentFile?.content || '// Select a file to start editing...'}
            onChange={handleEditorChange}
            theme={editorTheme}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true },
              wordWrap: 'bounded',
              autoClosingBrackets: 'always',
              tabSize: 2,
              insertSpaces: true,
              renderWhitespace: 'selection',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
              },
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading editor...</div>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Preview Area */}
      <Card className="mt-4 h-48">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
            {devServerStatus.isRunning && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Running on port {devServerStatus.port}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {devServerStatus.isRunning && devServerStatus.port ? (
            <iframe
              src={`http://localhost:${devServerStatus.port}`}
              className="w-full h-32 border-0 rounded-md"
              title="Live Preview"
              onError={() => console.log('Preview iframe error')}
            />
          ) : (
            <div className="h-32 bg-muted rounded-md flex items-center justify-center m-4">
              <div className="text-center text-muted-foreground">
                <Play className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click "Run" to see your React app live!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}