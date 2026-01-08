# ⚡ Quick Start Guide

## 🚀 Publish in 5 Minutes

### 1. Setup Environment
```bash
cd adex
cp env.example .env
# Edit .env with your values
```

### 2. Ensure Network Exists
```bash
docker network ls | grep raheed_default
# If not exists: docker network create raheed_default
```

### 3. Start Services
```bash
docker-compose up -d --build
```

### 4. Initialize Database
```bash
docker-compose exec app npm run init-db
docker-compose exec app npm run create-admin
```

### 5. Verify
```bash
docker-compose ps
docker network inspect raheed_default
curl http://localhost:3000
```

## 📦 GitHub Actions Setup

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Docker setup"
   git push origin main
   ```

2. **Enable Actions:**
   - Go to: Settings → Actions → General
   - Enable "Read and write permissions"
   - Save

3. **Check Actions tab** - workflow will run automatically

## 🔧 Nginx Config (Your Other App)

```nginx
location / {
    proxy_pass http://adex-app:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 📝 Common Commands

```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart app

# Update
docker-compose pull && docker-compose up -d --build

# Stop
docker-compose down
```

**For detailed instructions, see [PUBLISH_TUTORIAL.md](./PUBLISH_TUTORIAL.md)**

