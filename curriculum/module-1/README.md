# Module 1: Development Environment & Project Setup

**Duration:** 2 days | **Week:** 1

## What You'll Build
By the end of this module, you'll have all the tools installed and a complete project structure running on your computer, ready to build our task manager app.

## Before We Start: Are You New to Programming?

**If you've never used a terminal/command prompt before:**

**Windows Users:**
1. Press `Windows key + R`
2. Type `cmd` and press Enter
3. A black window appears - this is your "command prompt"
4. You'll type commands here (don't worry, we'll guide you!)

**Mac Users:**
1. Press `Cmd + Space` (spotlight search)
2. Type `terminal` and press Enter
3. A window appears - this is your "terminal"
4. You'll type commands here (each command ends with pressing Enter)

**Linux Users:**
You probably already know how to open a terminal! 😊

## Step-by-Step Instructions

### Step 1: Install Required Tools (15 minutes)

**We need to install 3 tools. Let's check what you have first:**

**Do this:** In your terminal/command prompt, type this command and press Enter:

```bash
node --version
```

**You should see:** Something like `v18.17.0` or higher

**If you see an error like "command not found" or "'node' is not recognized":**

#### Install Node.js:
1. **Go to** https://nodejs.org/en/download
2. **Download** the "LTS" version (left button, recommended for most users)
3. **Run the installer** and click "Next" through all the steps
4. **Restart your terminal/command prompt** (close and reopen it)
5. **Try the command again:** `node --version`

---

**Next, check npm (comes with Node.js):**

```bash
npm --version
```

**You should see:** Something like `9.6.7` or higher

**If you see an error:** Node.js installation should include npm. Try reinstalling Node.js.

---

```bash
npm --version
```

**You should see:** Something like `9.6.7` or higher

**If you see an error:** Node.js installation should include npm. Reinstall Node.js.

---

**Finally, check Git:**

```bash
git --version
```

**You should see:** Something like `git version 2.34.1`

**If you see an error like "command not found" or "'git' is not recognized":**

#### Install Git:

**Windows:**
1. **Go to** https://git-scm.com/downloads/win
2. **Download** and run the installer
3. **Important:** During installation, when asked about "Adjusting your PATH environment", choose "Git from the command line and also from 3rd-party software"
4. **Click "Next"** through other options (defaults are fine)
5. **Restart your terminal/command prompt**
6. **Try the command again:** `git --version`

**Mac:**
1. **Go to** https://git-scm.com/downloads/mac
2. **Download** and run the installer
3. **Follow the installation steps**
4. **Try the command again:** `git --version`

**Linux:**
```bash
# Ubuntu/Debian:
sudo apt update && sudo apt install git

# CentOS/RHEL:
sudo yum install git
```

---

### Step 1.5: Install a Code Editor (10 minutes)

**We need a code editor to write our code. We recommend VS Code (free and popular):**

#### Install VS Code:
1. **Go to** https://code.visualstudio.com/
2. **Click "Download"** (it should detect your operating system)
3. **Run the installer**
4. **Important for Windows:** Check "Add to PATH" during installation
5. **Open VS Code** after installation

**Test VS Code from terminal:**
```bash
code --version
```

**If this doesn't work:**
- **Windows:** Restart your terminal and try again
- **Mac:** Press `Cmd+Shift+P` in VS Code, type "shell command", select "Install 'code' command in PATH"

**Why we need these tools:**
- **Node.js**: Runs JavaScript on your computer (not just in browsers)
- **npm**: Downloads code libraries that other people wrote
- **Git**: Saves your work and tracks changes (like "Save As" but much better)
- **VS Code**: Where you'll write your code (like Microsoft Word, but for programming)

---

### Step 2: Create Your Own Project Folder (5 minutes)

**Important:** You'll create your OWN project outside the course folder. This keeps your work separate!

**Navigate to your home directory:**

```bash
# Go to your home/desktop area
cd ~
# Or if you prefer desktop:
# cd ~/Desktop
pwd
```

**You should see:** Your home directory path (like `/Users/yourname` or `C:\Users\yourname`)

**Create your personal project:**

```bash
mkdir my-task-manager
cd my-task-manager
```

**What this does:** Creates YOUR project folder, completely separate from the course materials.

**Verify it worked:** 
```bash
pwd
```
**You should see:** A path ending with "my-task-manager" (NOT inside SimpleTaskFlow!)

**Why separate?** 
- Course materials = readonly reference
- Your project = your personal work you can modify freely
- Prevents confusion between course code and your code

---

### Step 3: Set Up Git (5 minutes)

**Do this:** Type this command but replace with YOUR information (remove the quotes):

```bash
git config --global user.name "Your Actual Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "Sarah Johnson"
git config --global user.email "sarah.johnson@gmail.com"
```

**Important:** Use the SAME email you'll use for GitHub.

**Then do this:**
```bash
git init
```

**What this does:** Creates a Git repository in your folder to track changes.

---

### Step 4: Create Basic Project Structure (3 minutes)

**Do this:** Type these commands exactly:

```bash
mkdir client
mkdir server
```

**What this creates:**
- `client` folder = Frontend (what users see)
- `server` folder = Backend (handles data and logic)

**Verify it worked:** Type `ls` (Mac/Linux) or `dir` (Windows). You should see two folders.

---

### Step 5: Create Package.json (5 minutes)

**Do this:** Type this command:

```bash
npm init -y
```

**What you'll see:** A bunch of text about creating package.json

**Then do this:** Open the file that was created. If you have VS Code:

```bash
code package.json
```

**You should see something like:**
```json
{
  "name": "my-task-manager",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**Now change it to exactly this:**
```json
{
  "name": "my-task-manager",
  "version": "1.0.0",
  "description": "A personal task manager built with React and Node.js",
  "main": "index.js",
  "scripts": {
    "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
    "server:dev": "cd server && npm run dev",
    "client:dev": "cd client && npm run dev",
    "setup": "npm install && cd server && npm install && cd ../client && npm install"
  },
  "keywords": ["task-manager", "react", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Save the file** (Ctrl+S or Cmd+S).

**What this file does:** Tells npm about your project and how to run it.

---

### Step 6: Create .gitignore File (3 minutes)

**Do this:** Create a new file called `.gitignore` (note the dot at the beginning):

```bash
touch .gitignore
```

**Then open it:**
```bash
code .gitignore
```

**Type exactly this into the file:**
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.tsbuildinfo

# Database files
*.db
*.db-journal
*.sqlite
*.sqlite3

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Temporary folders
tmp/
temp/
```

**Save the file.**

**What this does:** Tells Git to ignore files we don't want to save (like temporary files and passwords).

---

### Step 7: Create README.md (3 minutes)

**Do this:** Create a README file:

```bash
touch README.md
code README.md
```

**Type exactly this:**
```markdown
# My Task Manager

A personal task management application built with React and Node.js.

## Features
- Create and manage tasks
- Mark tasks as complete
- Dark/light mode
- Grid and list views

## Getting Started

1. Install dependencies:
   ```bash
   npm run setup
   ```

2. Start the development servers:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + Prisma
- Database: SQLite
```

**Save the file.**

**What this does:** Documents what your project is and how to use it.

---

### Step 8: Install Development Dependencies (5 minutes)

**Do this:** Type this command:

```bash
npm install concurrently --save-dev
```

**What you'll see:** Text about downloading and installing packages. This is normal and takes a minute.

**What this does:** Installs `concurrently` which lets us run both frontend and backend at the same time.

---

### Step 9: Make Your First Git Commit (5 minutes)

**Do this:** Type these commands exactly:

```bash
git add .
```

**What this does:** Stages all your files for commit.

**Then:**
```bash
git commit -m "Initial project setup

- Created basic project structure
- Added package.json with workspace scripts
- Set up .gitignore for security
- Added README documentation"
```

**What you'll see:** Text about creating a commit.

**Why we do this:** Saves a snapshot of your work so you can never lose it.

---

### Step 10: Set Up GitHub (10 minutes)

**Do this:** Go to https://github.com and create an account if you don't have one.

**Then:** Click the "+" icon and select "New repository"

**Fill out:**
- Repository name: `my-task-manager`
- Description: `Personal task manager built with React and Node.js`
- Make it **Public** (so you can show it off!)
- Do NOT check any of the initialize boxes

**Click "Create repository"**

**You'll see a page with commands. Follow the "push an existing repository" section:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/my-task-manager.git
git branch -M main
git push -u origin main
```

**Replace YOUR_USERNAME with your actual GitHub username.**

**What this does:** Uploads your code to GitHub so it's backed up and others can see it.

---

### Step 11: Verify Everything Works (2 minutes)

**Check your file structure:** Type `ls -la` (Mac/Linux) or `dir` (Windows). You should see:
```
.git/
.gitignore
README.md
client/
node_modules/
package-lock.json
package.json
server/
```

**Check GitHub:** Go to your repository on GitHub. You should see all your files there.

**Celebrate!** 🎉 You've set up a professional development environment!

---

## Completion Checklist

✅ **Environment Setup**
- [ ] Node.js installed and working (`node --version` shows v18+)
- [ ] npm installed and working (`npm --version` shows 9+)
- [ ] Git installed and working (`git --version` shows 2.0+)
- [ ] Git configured with your name and email

✅ **Project Structure**
- [ ] Project folder created (`my-task-manager`)
- [ ] Client and server folders created
- [ ] package.json created with correct scripts
- [ ] .gitignore created with all necessary exclusions
- [ ] README.md created with project documentation

✅ **Git & GitHub**
- [ ] Git repository initialized
- [ ] First commit made with proper message
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub successfully
- [ ] Can view your code at https://github.com/YOUR_USERNAME/my-task-manager

✅ **Understanding Check**
- [ ] Can explain what Node.js does
- [ ] Can explain what npm does  
- [ ] Can explain what Git does
- [ ] Know where your project files are located
- [ ] Understand why we separate client and server

---

## 🧠 Knowledge Challenges

**Before moving to Module 2, test your understanding:**

### Challenge 1: File Navigation (Easy)
**Task:** Navigate to your project and list its contents.

**Do this:**
1. From any folder, navigate to your project
2. List all files and folders (including hidden ones)
3. Show your current location

**Expected result:** You should see `client/`, `server/`, `.git/`, `.gitignore`, `package.json`, `README.md`

**Stuck?** Check Step 2 and Step 11 above.

### Challenge 2: Git History (Easy)
**Task:** View your project's Git history.

**Do this:**
1. Navigate to your project folder
2. Show your commit history
3. Explain what your commit message means

**Expected result:** You should see one commit with your setup message.

**Stuck?** Look up the `git log` command or ask your Claude tutor.

### Challenge 3: Tool Verification (Medium)
**Task:** Verify all your tools are properly installed and working.

**Do this:**
1. Create a simple test to prove Node.js works
2. Create a simple test to prove Git works  
3. Prove you can edit files with VS Code

**Hint:** Try running `node -e "console.log('Node.js works!')"` and figure out the Git equivalent.

**Expected result:** All tools respond correctly.

### Challenge 4: Project Understanding (Medium)
**Task:** Explain your project structure to someone else.

**Do this:**
1. Write a brief explanation of what each file/folder does
2. Explain why we separated client and server
3. Predict what will go in each folder later

**Expected result:** Clear understanding of project organization.

---

## 🎯 Assessment Questions

**Answer these to verify your understanding:**

1. **If you run `npm install express` in your project, where will Express be installed?**
   
2. **Why do we use `.gitignore` instead of just not adding certain files?**

3. **What's the difference between your local Git repository and your GitHub repository?**

4. **If you deleted your `my-task-manager` folder, how would you get your code back?**

5. **Why did we create both a `client` and `server` folder?**

**Hint:** If you can't answer these, review the relevant steps above or ask your Claude tutor!

---

## What You Accomplished

🏆 **You just built a professional development foundation!** 

Most beginners skip this setup and struggle later. You now have:
- Version control with Git
- Professional project structure  
- Package management with npm
- GitHub backup and portfolio piece
- Scripts to run your future application

**Next:** In Module 2, you'll create the database that stores your tasks.

---

## Troubleshooting

**Problem:** `command not found` errors
**Solution:** The tool isn't installed. Follow the installation links above.

**Problem:** Permission errors on npm commands
**Solution:** Never use `sudo` with npm. If you see permission errors, research "npm permission fix" for your operating system.

**Problem:** Git asking for username/password repeatedly  
**Solution:** You may need to set up SSH keys or a personal access token. GitHub has guides for this.

**Problem:** Can't see hidden files (.gitignore)
**Solution:** In VS Code, use Ctrl+Shift+P (Cmd+Shift+P on Mac) and type "toggle hidden files"

---

## 🚨 Common Issues and Solutions

### "I can't open terminal/command prompt"

**Windows:**
- Try `Windows key + X` then select "Command Prompt" or "PowerShell"
- Or search for "cmd" in the Start menu

**Mac:**
- Try `Applications > Utilities > Terminal`
- Or search for "terminal" in Spotlight (Cmd+Space)

### "Node.js installation failed" or "Permission denied"

**Never use `sudo` on Mac/Linux for Node.js installation!**

**Better solution:**
1. Completely uninstall Node.js first
2. Use the official installer from nodejs.org
3. Make sure you're logged in as an administrator

**Windows:** Right-click the installer and "Run as administrator"

### "Git installation seems stuck"

**This is normal!** Git installer can take 5-10 minutes, especially on Windows. Be patient.

### "VS Code won't open from terminal"

**Windows:**
1. Restart your terminal after VS Code installation
2. If still doesn't work, manually add VS Code to PATH:
   - Open VS Code normally
   - Press `Ctrl+Shift+P`
   - Type "shell command" 
   - Select "Install 'code' command in PATH"

**Mac:**
1. Open VS Code normally
2. Press `Cmd+Shift+P`  
3. Type "shell command"
4. Select "Install 'code' command in PATH"

### "I'm getting permission errors"

**Mac/Linux:** Never use `sudo` unless explicitly told to. If you see permission errors:
1. Make sure you own your home directory
2. Try creating the project in a different location (like Desktop)

**Windows:** Make sure you're running terminal as administrator if needed.

### "Commands not found after installation"

**Solution:** Restart your terminal/command prompt completely (close and reopen). This is required for new installations to be recognized.

### "I'm scared I'll break something"

**Don't worry!** 
- These commands can't damage your computer
- We're only installing standard development tools
- Millions of developers use these exact same tools
- If something goes wrong, you can always reinstall

### "This is too complicated"

**It's normal to feel overwhelmed!**
- Every professional developer started exactly where you are
- The first day is always the hardest
- Once tools are installed, everything gets much easier
- Your Claude tutor is here to help every step of the way

---

**Need Help?** Ask your Claude tutor specific questions about any step you don't understand. Include:
- Your operating system (Windows/Mac/Linux)
- The exact error message you see
- Which step you're on
- What happened when you tried the step