# 🐳 Docker Hub Build Setup

This guide explains how to set up automatic Docker image building and pushing to Docker Hub using GitHub Actions.

## ✅ Quick Setup

### Step 1: Create Docker Hub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

   **Secret 1:**
   - Name: `DOCKER_USERNAME`
   - Value: Your Docker Hub username

   **Secret 2:**
   - Name: `DOCKER_PASSWORD`
   - Value: Your Docker Hub password or Personal Access Token
   
   **💡 Recommended:** Use a Personal Access Token instead of password:
   - Go to Docker Hub → Account Settings → Security → New Access Token
   - Create token with "Read, Write & Delete" permissions
   - Use this token as `DOCKER_PASSWORD`

### Step 2: Push Code to Trigger Build

```bash
git add .
git commit -m "Configure Docker Hub build"
git push origin main
```

### Step 3: Check Build Status

1. Go to your repository → **Actions** tab
2. Click on **"Build and Push Docker Image"** workflow
3. Watch the build progress

### Step 4: Verify Image on Docker Hub

1. Go to [hub.docker.com](https://hub.docker.com)
2. Login and go to your repositories
3. Find `adex`
4. You should see tags: `latest`, `main`, `main-{sha}`

## 📦 Image Location

Your images will be available at:
```
docker.io/YOUR_DOCKER_USERNAME/adex:latest
docker.io/YOUR_DOCKER_USERNAME/adex:main
docker.io/YOUR_DOCKER_USERNAME/adex:main-{commit-sha}
```

## 🔄 Manual Trigger

You can manually trigger the build:

1. Go to repository → **Actions** tab
2. Click **"Build and Push Docker Image"** workflow
3. Click **"Run workflow"** button
4. Select branch and click **"Run workflow"**

## 📥 Pull and Use the Image

### Pull the Image

```bash
docker pull YOUR_DOCKER_USERNAME/adex:latest
```

### Use in docker-compose.yml

Update your `docker-compose.yml`:

```yaml
services:
  app:
    image: YOUR_DOCKER_USERNAME/adex:latest
    # Remove build section
    # build:
    #   context: .
    #   dockerfile: Dockerfile
```

Then run:
```bash
docker-compose pull
docker-compose up -d
```

## 🔍 Build Cache

The workflow uses Docker Hub registry cache for faster builds:
- Cache image: `YOUR_DOCKER_USERNAME/adex:buildcache`
- First build: Slower (no cache)
- Subsequent builds: Faster (uses cache)

## ⚙️ Workflow Details

### Triggers
- ✅ Push to `main` branch
- ✅ Manual trigger via `workflow_dispatch`

### Build Configuration
- **Platform:** `linux/amd64`
- **Cache:** Registry-based cache
- **Tags:** 
  - `latest` (main branch only)
  - `main` (branch name)
  - `main-{commit-sha}` (specific commit)

## 🛠️ Troubleshooting

### Build Fails - Authentication Error

**Error:** `unauthorized: authentication required`

**Solution:**
1. Verify `DOCKER_USERNAME` secret is correct
2. Verify `DOCKER_PASSWORD` secret is correct
3. If using password, try Personal Access Token instead
4. Ensure token has "Read, Write & Delete" permissions

### Build Fails - Permission Denied

**Error:** `denied: requested access to the resource is denied`

**Solution:**
1. Check Docker Hub repository exists
2. Verify repository is public or you have access
3. Check username matches repository owner

### Cache Not Working

**Solution:**
- First build always slower (no cache)
- Subsequent builds use cache automatically
- Cache is stored as `adex:buildcache` on Docker Hub

### Image Not Appearing on Docker Hub

**Solution:**
1. Wait a few minutes (Docker Hub sync delay)
2. Refresh Docker Hub page
3. Check build logs for errors
4. Verify push step completed successfully

## 🔐 Security Best Practices

1. **Use Personal Access Token** instead of password
2. **Never commit secrets** to repository
3. **Rotate tokens** regularly
4. **Use least privilege** - only "Read, Write & Delete" permissions needed
5. **Monitor access** - check Docker Hub security logs

## 📊 Build Status Badge

Add to your README.md:

```markdown
![Docker Build](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Build%20and%20Push%20Docker%20Image/badge.svg)
```

## ✅ Verification Checklist

- [ ] Docker Hub secrets configured (`DOCKER_USERNAME`, `DOCKER_PASSWORD`)
- [ ] Workflow file exists (`.github/workflows/ci-cd.yml`)
- [ ] Code pushed to `main` branch
- [ ] Build triggered (check Actions tab)
- [ ] Build completed successfully
- [ ] Image visible on Docker Hub
- [ ] Can pull image locally

## 🎉 Success!

Once you see:
- ✅ Green checkmark in Actions tab
- ✅ Image on Docker Hub
- ✅ Can pull image successfully

Your Docker Hub build setup is complete! Every push to `main` will automatically build and push a new image.

## 📚 Next Steps

1. **Set up automatic deployment** - Pull latest image on server
2. **Configure webhooks** - Get notified when builds complete
3. **Set up image scanning** - Enable security scanning
4. **Add version tags** - Use semantic versioning for releases

---

**Need help?** Check the build logs in the Actions tab for detailed error messages.

