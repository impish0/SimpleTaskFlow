import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, PlayCircle, Sparkles } from "lucide-react"

interface WelcomeOverlayProps {
  onStart: () => void
}

export function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const { theme, resolvedTheme } = useTheme()
  
  // Force re-render when theme changes to ensure proper styling
  React.useEffect(() => {
    // This effect will run when theme changes, causing a re-render
  }, [theme, resolvedTheme])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full animate-in border-2 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Code2 className="h-12 w-12 text-brand-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to SimpleTaskFlow Interactive!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Build a complete React + Node.js task manager with your AI tutor guiding every step.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Code2 className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold">Real Development</h3>
              <p className="text-sm text-muted-foreground">
                Work with actual files, real terminal, real git
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-brand-secondary" />
              </div>
              <h3 className="font-semibold">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">
                Claude watches your code and helps when you're stuck
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <PlayCircle className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold">Step-by-Step</h3>
              <p className="text-sm text-muted-foreground">
                Learn at your pace with guided micro-challenges
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🚀 What You'll Build:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• A complete task management application</li>
              <li>• React components with TypeScript</li>
              <li>• Real project you can show employers</li>
              <li>• Professional development workflow</li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Button 
              onClick={onStart}
              variant="default"
              size="lg"
              className="w-full max-w-xs font-semibold py-3 px-6 text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🚀 Start Learning Now!
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No setup required - everything runs locally on your machine
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}