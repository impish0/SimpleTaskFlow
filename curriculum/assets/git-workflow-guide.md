# Git Workflow Guide for Development

This guide covers the Git commands you'll use throughout the curriculum to track your progress and build good development habits.

## Daily Git Workflow

### Basic Cycle: Edit → Stage → Commit → Push

```bash
# 1. Check status before starting work
git status

# 2. Make your code changes...

# 3. Check what changed
git status
git diff

# 4. Stage files for commit
git add .                    # Add all changed files
git add filename.txt         # Add specific file
git add client/src/         # Add specific directory

# 5. Commit with descriptive message
git commit -m "Add task creation form with validation

- Created TaskForm component with input fields
- Added form validation for required fields
- Implemented submit handler for API calls
- Added loading state during submission"

# 6. Push to GitHub
git push
```

## Commit Message Best Practices

### Format Structure
```
Short summary (50 characters or less)

Longer description explaining what and why (if needed):
- Bullet point for specific changes
- Another bullet point for important details
- Focus on WHY the change was made, not just WHAT
```

### Good Examples
```bash
# Feature addition
git commit -m "Add task filtering by category

- Implement category filter dropdown
- Update API client to send category parameter
- Add filter state management in Dashboard
- Improve user experience with clear filter indicators"

# Bug fix
git commit -m "Fix task completion toggle not updating UI

The optimistic update was failing when API call succeeded
but local state wasn't properly synchronized. Now properly
updates both local state and refetches from server."

# Refactoring
git commit -m "Refactor task validation into reusable hook

- Extract validation logic from TaskForm component
- Create useTaskValidation custom hook
- Improve testability and reusability
- No functional changes to user interface"
```

### Poor Examples (Avoid These)
```bash
# Too vague
git commit -m "fix stuff"
git commit -m "update"
git commit -m "changes"

# Too detailed for commit message
git commit -m "change line 42 in TaskForm.tsx from const to let"

# Present tense vs past tense inconsistency  
git commit -m "Added feature"  # Use "Add feature" instead
```

## Common Git Commands

### Checking Status and History
```bash
# See current status
git status

# See changes made to files
git diff

# See commit history
git log
git log --oneline          # Condensed view
git log --graph --oneline  # Visual branch history

# See specific commit details
git show <commit-hash>
```

### Undoing Changes
```bash
# Undo changes to a file (before staging)
git checkout -- filename.txt

# Unstage a file (after git add, before commit)
git reset filename.txt

# Undo last commit (keeps changes in working directory)
git reset --soft HEAD~1

# See what would be affected before hard reset
git reset --hard HEAD~1    # DANGER: Permanently loses changes
```

### Working with Remote Repository
```bash
# See remote repositories
git remote -v

# Fetch latest changes from GitHub (doesn't merge)
git fetch

# Pull latest changes and merge
git pull

# Push your changes to GitHub
git push

# Push new branch to GitHub
git push -u origin branch-name
```

## Module-by-Module Commit Suggestions

### Module 1: Environment Setup
```bash
git commit -m "Complete Module 1: Development environment setup

- Configure Node.js, npm, and Git
- Set up project structure with client/server directories
- Create comprehensive .gitignore
- Configure GitHub repository and initial push"
```

### Module 2: Database Setup
```bash
git commit -m "Complete Module 2: Database design with Prisma

- Create Prisma schema with Task model
- Define Category and Priority enums
- Set up database migrations
- Add seed data for development testing"
```

### Module 3: Backend API
```bash
git commit -m "Complete Module 3: Express API with CRUD operations

- Implement all task endpoints (GET, POST, PUT, DELETE)
- Add input validation and error handling
- Configure CORS and middleware
- Add comprehensive API testing"
```

### Continue this pattern for each module...

## Branching for Features (Optional Advanced Topic)

As you get comfortable with Git, you might want to use branches for larger features:

```bash
# Create and switch to new branch
git checkout -b feature/task-filters

# Work on your feature...
# Make commits...

# Switch back to main
git checkout main

# Merge your feature
git merge feature/task-filters

# Delete the feature branch
git branch -d feature/task-filters
```

## Troubleshooting Common Issues

### "Repository not found" when pushing
- Check your remote URL: `git remote -v`
- Verify your GitHub username and repository name
- Make sure you have permission to push to the repository

### "Merge conflict" messages
- Usually happens when collaborating or working on multiple machines
- Git will mark conflicted files - edit them to resolve conflicts
- After resolving, add and commit the resolved files

### Accidentally committed sensitive information
- Remove from tracking: `git rm --cached filename`
- Add to .gitignore to prevent future commits
- Consider the information compromised if already pushed to GitHub

### Want to change last commit message
```bash
# If you haven't pushed yet
git commit --amend -m "New commit message"

# If you've already pushed, avoid changing history
```

## Best Practices for This Course

1. **Commit frequently** - After completing each exercise or fixing each bug
2. **Write descriptive messages** - Your future self will thank you
3. **Commit working code** - Don't commit broken code
4. **Push regularly** - Don't lose your work
5. **Keep commits focused** - One logical change per commit

## Portfolio Benefits

By the end of this course, you'll have:
- A complete project with detailed commit history
- Evidence of your learning progression
- Good Git habits that employers value
- A portfolio piece hosted on GitHub

Remember: Your commit history tells the story of your development journey. Make it a good story! 🚀