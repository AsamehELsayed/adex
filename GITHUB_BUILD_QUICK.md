# ⚡ GitHub Build - Quick Reference

## 🚀 Setup in 3 Commands

```bash
# 1. Push code to GitHub
git add .
git commit -m "Add GitHub Actions"
git push origin main

# 2. Enable Actions (via GitHub web UI)
# Settings → Actions → General → Enable "Read and write permissions"

# 3. Check build status
# Go to: Actions tab → See workflow running
```

## 📦 Your Image Will Be At:

```
ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
```

## 🔍 Check Build Status

1. Go to repository → **Actions** tab
2. Click on workflow run
3. See build progress

## 📥 Pull Built Image

```bash
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
```

## ✅ What Happens Automatically

- ✅ Builds on every push
- ✅ Tests your code
- ✅ Builds Docker image
- ✅ Pushes to GitHub Container Registry
- ✅ Tags with branch name and latest

**For detailed guide, see [GITHUB_BUILD_SETUP.md](./GITHUB_BUILD_SETUP.md)**

