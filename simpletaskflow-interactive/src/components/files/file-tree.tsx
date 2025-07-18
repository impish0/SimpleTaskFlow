import * as React from "react"
import { useFileStore, type FileNode } from "@/stores/fileStore"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileTreeNodeProps {
  node: FileNode
  depth: number
  onFileSelect: (path: string) => void
  selectedFile?: string
}

function FileTreeNode({ node, depth, onFileSelect, selectedFile }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(depth < 2) // Auto-expand first two levels
  
  const isSelected = selectedFile === node.path
  const isDirectory = node.type === 'directory'
  
  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect(node.path)
    }
  }
  
  const Icon = isDirectory 
    ? (isExpanded ? FolderOpen : Folder)
    : File
    
  const ChevronIcon = isDirectory 
    ? (isExpanded ? ChevronDown : ChevronRight)
    : null

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-accent rounded-sm",
          isSelected && "bg-accent text-accent-foreground",
          "transition-colors"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {ChevronIcon && (
          <ChevronIcon className="h-3 w-3 mr-1 text-muted-foreground" />
        )}
        <Icon className={cn(
          "h-4 w-4 mr-2",
          isDirectory ? "text-blue-500" : "text-muted-foreground"
        )} />
        <span className="truncate">{node.name}</span>
        {node.size !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>
      
      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree() {
  const { fileTree, currentFile, loadFile } = useFileStore()
  
  const handleFileSelect = (path: string) => {
    loadFile(path)
  }
  
  if (fileTree.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No project files found</p>
        <p className="text-xs mt-1">Click "Start Learning" to create your project</p>
      </div>
    )
  }
  
  return (
    <div className="p-2">
      <div className="mb-2 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Project Files
      </div>
      {fileTree.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={0}
          onFileSelect={handleFileSelect}
          selectedFile={currentFile?.path}
        />
      ))}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}