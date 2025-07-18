import * as React from "react"
import { Code2, BookOpen, MessageSquare, Play, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FileTree } from "@/components/files/file-tree"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false)
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <Code2 className="h-8 w-8 text-brand-primary" />
            <h1 className="text-xl font-semibold">SimpleTaskFlow Interactive</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar - Curriculum & Files */}
        <div className={`flex-shrink-0 transition-all duration-300 ${
          leftPanelCollapsed ? 'w-12' : 'w-80'
        }`}>
          {!leftPanelCollapsed ? (
            <aside className="w-full h-full border-r border-border bg-card flex flex-col relative">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-lg mb-2">Learning Path</h2>
                <p className="text-sm text-muted-foreground">
                  Build a full-stack task manager step by step
                </p>
              </div>
              
              {/* Curriculum Section */}
              <div className="p-4 space-y-4 border-b border-border">
                <Card className="border-brand-primary bg-brand-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-brand-primary">
                      Module 1: Project Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                        Create React App
                      </div>
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                        Install Dependencies
                      </div>
                      <div className="flex items-center text-brand-primary font-medium">
                        <div className="w-2 h-2 bg-brand-primary rounded-full mr-2" />
                        Create First Component
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full mr-2" />
                        Add Styling
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* File Tree Section */}
              <div className="flex-1 overflow-auto">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Project Files</h3>
                  </div>
                </div>
                <FileTree />
              </div>
              
              {/* Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 z-10"
                onClick={() => setLeftPanelCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </aside>
          ) : (
            <div className="w-full h-full border-r border-border bg-card flex flex-col items-center py-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 mb-2"
                onClick={() => setLeftPanelCollapsed(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="rotate-90 text-xs text-muted-foreground whitespace-nowrap mt-4">
                Files
              </div>
            </div>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>

        {/* Right Sidebar - AI Tutor */}
        <div className={`flex-shrink-0 transition-all duration-300 ${
          rightPanelCollapsed ? 'w-12' : 'w-80'
        }`}>
          {!rightPanelCollapsed ? (
            <aside className="w-full h-full border-l border-border bg-card flex flex-col relative">
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-brand-secondary" />
                  <h3 className="font-semibold">AI Tutor</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      👋 Hi! I'm Claude, your coding tutor. I'll help you build this app step by step.
                    </p>
                  </div>
                  
                  <div className="bg-brand-primary/10 p-3 rounded-lg border border-brand-primary/20">
                    <p className="text-sm">
                      🎯 <strong>Current Goal:</strong> Create your first React component. 
                      I'll guide you through writing the code and explain what each part does.
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>💡 <strong>Tip:</strong> Type your code - don't copy/paste! You'll learn better.</p>
                    <p>🚀 <strong>Ready?</strong> Let's start coding!</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <input 
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
                    placeholder="Ask me anything..."
                  />
                  <Button size="icon" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 z-10"
                onClick={() => setRightPanelCollapsed(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </aside>
          ) : (
            <div className="w-full h-full border-l border-border bg-card flex flex-col items-center py-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 mb-2"
                onClick={() => setRightPanelCollapsed(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="rotate-90 text-xs text-muted-foreground whitespace-nowrap mt-4">
                AI Tutor
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}