# 🐙 GitHub Build Setup Guide

This guide will help you set up automatic Docker image building on GitHub when you push code.

## ✅ Quick Setup (5 Steps)

### Step 1: Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Add Docker setup with GitHub Actions"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under **"Workflow permissions"**, select:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### Step 3: Verify Workflow File Exists

Make sure this file exists in your repo:
```
.github/workflows/ci-cd.yml
```

If it doesn't exist, the workflow file is already created in your project. Just push it:

```bash
git add .github/workflows/ci-cd.yml
git commit -m "Add GitHub Actions workflow"
git push
```

### Step 4: Trigger the Build

Make any small change and push:

```bash
# Make a small change
echo "# Built on GitHub" >> README.md

# Commit and push
git add .
git commit -m "Trigger GitHub build"
git push
```

### Step 5: Check Build Status

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. You should see your workflow running
4. Wait for it to complete (green checkmark ✅)

## 📦 Accessing Your Built Images

After the build completes:

1. Go to your repository on GitHub
2. Click **"Packages"** (right sidebar, or go to `github.com/YOUR_USERNAME?tab=packages`)
3. Find your Docker image: `ghcr.io/YOUR_USERNAME/YOUR_REPO`
4. Click on it to see all versions/tags

### Image Tags

Your images will be tagged with:
- `latest` - Latest build from main/master branch
- `main` or `master` - Latest build from that branch
- `develop` - Latest build from develop branch
- `sha-{commit-hash}` - Specific commit hash
- Branch names - For other branches

## 🔍 Viewing Build Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on **"Build Docker Image"** job
4. Expand steps to see detailed logs

## 🚀 Using the Built Image

### Pull the Image

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
```

### Use in docker-compose.yml

Update your `docker-compose.yml`:

```yaml
services:
  app:
    image: ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
    # Remove the build section
    # build:
    #   context: .
    #   dockerfile: Dockerfile
```

Then run:
```bash
docker-compose pull
docker-compose up -d
```

## 🔐 Setting Up GitHub Token (For Private Repos)

If your repository is private, you need a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"**
3. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages`
4. Generate and copy the token
5. Go to your repository → Settings → Secrets → Actions
6. Add new secret:
   - Name: `GITHUB_TOKEN`
   - Value: Your token

**Note:** For public repos, `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## 📋 Build Triggers

The workflow builds automatically on:
- ✅ Push to `main` branch
- ✅ Push to `master` branch
- ✅ Push to `develop` branch
- ✅ Push to any other branch
- ✅ Pull requests to main/master/develop

## 🛠️ Troubleshooting

### Build Fails

1. **Check Actions tab** for error messages
2. **Common issues:**
   - Missing Dockerfile
   - Syntax errors in workflow file
   - Permission issues
   - Build context path incorrect

### Image Not Appearing

1. Check if build job completed successfully
2. Go to Packages tab (not Actions)
3. Make sure you're looking at the right repository
4. Check image visibility settings (public/private)

### Permission Denied

1. Go to Settings → Actions → General
2. Ensure "Read and write permissions" is enabled
3. For private repos, ensure `GITHUB_TOKEN` secret is set

### Build Takes Too Long

- The first build is slower (no cache)
- Subsequent builds use cache and are faster
- Build time depends on:
  - Dependencies size
  - Build complexity
  - GitHub Actions runner availability

## 📊 Build Status Badge

Add a build status badge to your README:

```markdown
![Build Status](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/CD%20Pipeline/badge.svg)
```

## 🔄 Automatic Deployment (Optional)

To automatically deploy after build, edit `.github/workflows/ci-cd.yml` and customize the deploy job.

See `PUBLISH_TUTORIAL.md` for deployment options.

## ✅ Verification Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Actions enabled
- [ ] Workflow file exists (`.github/workflows/ci-cd.yml`)
- [ ] Build triggered (check Actions tab)
- [ ] Build completed successfully
- [ ] Image visible in Packages tab
- [ ] Can pull image locally

## 🎉 Success!

Once you see:
- ✅ Green checkmark in Actions tab
- ✅ Image in Packages tab
- ✅ Can pull image successfully

Your GitHub build setup is complete! Every time you push code, a new Docker image will be built automatically.

## 📚 Next Steps

1. **Set up automatic deployment** - See `PUBLISH_TUTORIAL.md`
2. **Configure environment-specific builds** - Use different tags for dev/staging/prod
3. **Add build notifications** - Get notified when builds complete
4. **Set up image scanning** - Enable security scanning for your images

---

**Need help?** Check the build logs in the Actions tab for detailed error messages.

