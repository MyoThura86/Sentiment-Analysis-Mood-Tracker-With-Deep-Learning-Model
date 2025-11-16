# Git Repository Setup Guide

This guide will help you upload your MoodTracker project to GitHub and set up version control.

## 🚀 Quick Setup (Recommended)

### 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository settings:
   - **Repository name**: `moodtracker-ai` (or your preferred name)
   - **Description**: AI-Powered Mental Health Sentiment Analysis Platform
   - **Visibility**: Choose Public or Private
   - **Add README**: ❌ (we already have one)
   - **Add .gitignore**: ✅ Select "Python" template
   - **Add license**: ✅ Select "MIT License"

### 2. Initialize Local Git Repository
```bash
# Navigate to your project directory
cd C:\Users\User\sentiment_project\Special_project

# Initialize git repository
git init

# Add all files to staging
git add .

# Make initial commit
git commit -m "Initial commit: MoodTracker AI Mental Health Platform

🎯 Features:
- Dual AI sentiment analysis (RoBERTa + LSTM)
- Interactive journaling with real-time analysis
- 18 evidence-based coping strategies
- CSV bulk analysis for research
- User authentication & profiles
- Responsive Material-UI design

🧠 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 3. Connect to GitHub and Push
```bash
# Add remote origin (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/moodtracker-ai.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 📁 Recommended .gitignore

Create or update `.gitignore` file:

```gitignore
# Node.js dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn-integrity

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
ENV/
env.bak/
venv.bak/

# AI Models (large files)
*.keras
*.h5
*.pkl
*.joblib
Fine_tuned_RoBERTa/pytorch_model.bin
mentalbert_sentiment_model/pytorch_model.bin

# Data files
*.csv
*.json.backup
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
*.tmp
*.temp
```

## 🔄 Development Workflow

### Daily Development
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: enhanced sentiment visualization"

# Push to GitHub
git push
```

### Working with Branches
```bash
# Create and switch to new feature branch
git checkout -b feature/new-coping-strategy

# Make changes and commit
git add .
git commit -m "Add mindfulness meditation strategy"

# Push branch to GitHub
git push -u origin feature/new-coping-strategy

# Switch back to main
git checkout main

# Merge feature (after testing)
git merge feature/new-coping-strategy
git push
```

## 📋 Pre-Upload Checklist

### ✅ Files to Include
- [x] `README.md` - Comprehensive documentation
- [x] `requirements.txt` - Python dependencies
- [x] `package.json` - Node.js dependencies
- [x] `src/` - Frontend React application
- [x] `api/` - Backend Flask application
- [x] Configuration files (`vite.config.js`, etc.)

### ⚠️ Files to Exclude (add to .gitignore)
- [ ] Large model files (`*.keras`, `*.h5`)
- [ ] Environment variables (`.env` files)
- [ ] Node modules (`node_modules/`)
- [ ] Python cache (`__pycache__/`)
- [ ] Personal data files (`*.db`, user data)

### 🔒 Security Check
- [ ] No API keys or secrets in code
- [ ] No personal information in sample data
- [ ] No production database files
- [ ] Environment variables properly documented

## 📦 Model Files Handling

Your AI models are large files that shouldn't be in Git. Here are options:

### Option 1: Git LFS (Large File Storage)
```bash
# Install git-lfs
git lfs install

# Track large model files
git lfs track "*.keras"
git lfs track "*.h5"
git lfs track "Fine_tuned_RoBERTa/pytorch_model.bin"

# Add .gitattributes
git add .gitattributes

# Commit and push
git commit -m "Add LFS tracking for model files"
git push
```

### Option 2: External Storage (Recommended)
1. Upload models to Google Drive, Dropbox, or Hugging Face Hub
2. Add download script in README
3. Keep models in .gitignore

```python
# download_models.py
import requests
import os

def download_file(url, filename):
    response = requests.get(url)
    with open(filename, 'wb') as f:
        f.write(response.content)

# Add download URLs for your models
models = {
    "mentalbert_lstm_model.keras": "https://your-storage-url/model.keras",
    # Add other model URLs
}

for filename, url in models.items():
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        download_file(url, filename)
```

## 🏷️ Releases and Tags

### Creating Releases
```bash
# Tag a version
git tag -a v1.0.0 -m "Initial release: MoodTracker AI Platform"

# Push tags
git push origin --tags
```

### GitHub Release
1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Select tag `v1.0.0`
4. Release title: "MoodTracker v1.0.0 - AI Mental Health Platform"
5. Description:
```markdown
## 🎉 Initial Release

### Features
- ✨ Dual AI sentiment analysis (RoBERTa + LSTM)
- 📝 Interactive journaling with real-time insights
- 🧠 18 evidence-based coping strategies
- 📊 CSV analysis for research datasets
- 🔐 User authentication & profiles
- 📱 Responsive Material-UI design

### What's Included
- Complete React frontend application
- Flask backend with AI integration
- Comprehensive documentation
- Setup and deployment guides

### Getting Started
See the [README.md](README.md) for setup instructions.
```

## 🔧 Repository Settings

### Branch Protection
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### Issues Template
Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js version: [e.g. 16.14.0]
- Python version: [e.g. 3.9.0]
```

## 🚀 Deployment Options

### GitHub Pages (Frontend Only)
```bash
# Build for production
npm run build

# Deploy to gh-pages
git subtree push --prefix dist origin gh-pages
```

### Heroku (Full Stack)
1. Create `Procfile`:
```
web: python api/auth_api.py
```

2. Deploy:
```bash
heroku create moodtracker-ai
git push heroku main
```

### Vercel (Frontend) + Railway (Backend)
- Frontend: Connect GitHub to Vercel
- Backend: Deploy API to Railway or similar service

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section in README.md
2. Search existing GitHub issues
3. Create a new issue with detailed information

## 🎯 Next Steps

After uploading to GitHub:
1. ⭐ Star your own repository
2. 📄 Add a license file
3. 🏷️ Create your first release
4. 📢 Share with the community
5. 🔄 Set up CI/CD (GitHub Actions)

---

**Happy coding! 🎉**

Your MoodTracker AI platform is now ready to help others with their mental health journey.