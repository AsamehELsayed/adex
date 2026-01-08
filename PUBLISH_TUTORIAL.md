# 🚀 Publishing Tutorial - Step by Step Guide

This tutorial will guide you through publishing your ADEX application using Docker Compose and GitHub Actions CI/CD.

## Prerequisites Checklist

- [ ] Docker and Docker Compose installed
- [ ] GitHub account and repository
- [ ] Server/VM with Docker installed (for production deployment)
- [ ] Access to the `raheed_default` network (should exist from your other app)

---

## Part 1: Local Setup & Testing

### Step 1: Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   cd adex
   cp env.example .env
   ```

2. **Edit `.env` file** with your configuration:
   ```env
   # Database Configuration
   DB_HOST=mysql
   DB_PORT=3306
   DB_NAME=adex_db
   DB_USER=adex_user
   DB_PASSWORD=your-secure-password-here
   DB_ROOT_PASSWORD=your-secure-root-password-here

   # Application Configuration
   NODE_ENV=production
   APP_PORT=3000

   # JWT Secret (IMPORTANT: Generate a strong secret!)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

   **💡 Tip:** Generate a strong JWT secret:
   ```bash
   # On Linux/Mac
   openssl rand -base64 32
   
   # On Windows PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

### Step 2: Ensure raheed_default Network Exists

The `raheed_default` network should already exist from your other app. Verify it:

```bash
docker network ls | grep raheed_default
```

If it doesn't exist, create it:
```bash
docker network create raheed_default
```

### Step 3: Build and Start Services

1. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **Check if containers are running:**
   ```bash
   docker-compose ps
   ```

   You should see:
   - `adex-mysql` - MySQL database
   - `adex-app` - Next.js application

3. **View logs to ensure everything started correctly:**
   ```bash
   # View all logs
   docker-compose logs -f
   
   # View app logs only
   docker-compose logs -f app
   
   # View MySQL logs only
   docker-compose logs -f mysql
   ```

### Step 4: Initialize Database

1. **Wait for MySQL to be ready** (check logs until you see "ready for connections")

2. **Initialize the database:**
   ```bash
   docker-compose exec app npm run init-db
   ```

3. **Create admin user:**
   ```bash
   docker-compose exec app npm run create-admin
   ```
   
   Follow the prompts to create your admin account.

### Step 5: Verify Connection to raheed_default Network

Check that your app container is connected to the network:

```bash
docker network inspect raheed_default
```

You should see `adex-app` listed in the containers.

### Step 6: Test Locally

1. **Access the application:**
   - Open browser: `http://localhost:3000`
   - Test admin login: `http://localhost:3000/admin/login`

2. **Test API endpoints:**
   ```bash
   # Test health (if you have a health endpoint)
   curl http://localhost:3000/api/contacts
   ```

---

## Part 2: GitHub Actions CI/CD Setup

### Step 7: Push Code to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Docker setup"
   ```

2. **Create GitHub repository** (if not exists):
   - Go to GitHub.com
   - Click "New repository"
   - Name it (e.g., `adex`)
   - Don't initialize with README (if you already have code)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 8: Enable GitHub Actions

1. **Go to your repository on GitHub**
2. **Click "Settings" → "Actions" → "General"**
3. **Under "Workflow permissions"**, select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. **Click "Save"**

### Step 9: Configure GitHub Secrets (Optional - for auto-deployment)

If you want automatic deployment, add these secrets:

1. **Go to:** Settings → Secrets and variables → Actions → New repository secret

2. **Add these secrets:**
   - `HOST` - Your server IP address (e.g., `192.168.1.100` or `your-server.com`)
   - `USERNAME` - SSH username for your server
   - `SSH_KEY` - Your private SSH key content
   - `DEPLOYMENT_URL` - Your application URL (e.g., `https://yourdomain.com`)

   **💡 Tip:** Generate SSH key if you don't have one:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   # Copy the private key content to GitHub Secrets
   # Add the public key to your server: ~/.ssh/authorized_keys
   ```

### Step 10: Verify CI/CD Pipeline

1. **Make a small change and push:**
   ```bash
   echo "# Test" >> README.md
   git add .
   git commit -m "Test CI/CD pipeline"
   git push
   ```

2. **Check GitHub Actions:**
   - Go to your repository
   - Click "Actions" tab
   - You should see the workflow running
   - Wait for it to complete (green checkmark ✅)

3. **Verify Docker image was built:**
   - Go to your repository
   - Click "Packages" (right sidebar)
   - You should see your Docker image: `ghcr.io/YOUR_USERNAME/YOUR_REPO`

---

## Part 3: Production Deployment

### Option A: Manual Deployment (Recommended for first time)

#### Step 11: Prepare Your Server

1. **SSH into your server:**
   ```bash
   ssh username@your-server-ip
   ```

2. **Install Docker and Docker Compose** (if not installed):
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Logout and login again** to apply Docker group changes

#### Step 12: Clone Repository on Server

```bash
cd /opt  # or your preferred directory
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git adex
cd adex/adex
```

#### Step 13: Create Production Environment File

```bash
cp env.example .env
nano .env  # or use your preferred editor
```

**Update `.env` with production values:**
```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=adex_db_prod
DB_USER=adex_user_prod
DB_PASSWORD=STRONG_PRODUCTION_PASSWORD
DB_ROOT_PASSWORD=STRONG_ROOT_PASSWORD
NODE_ENV=production
APP_PORT=3000
JWT_SECRET=STRONG_JWT_SECRET_FROM_STEP_1
```

#### Step 14: Ensure raheed_default Network Exists

```bash
docker network ls | grep raheed_default
```

If it doesn't exist:
```bash
docker network create raheed_default
```

#### Step 15: Start Services

```bash
# Build and start
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 16: Initialize Database

```bash
# Wait for MySQL to be ready, then:
docker-compose exec app npm run init-db
docker-compose exec app npm run create-admin
```

#### Step 17: Verify Deployment

1. **Check containers are running:**
   ```bash
   docker ps
   ```

2. **Check network connectivity:**
   ```bash
   docker network inspect raheed_default
   ```

3. **Test the application:**
   ```bash
   curl http://localhost:3000
   ```

---

### Option B: Automated Deployment with GitHub Actions

#### Step 11: Update GitHub Actions Workflow

Edit `.github/workflows/ci-cd.yml` and customize the deployment section:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USERNAME }}
    key: ${{ secrets.SSH_KEY }}
    script: |
      cd /opt/adex/adex
      git pull
      docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull
      docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
      docker-compose exec app npm run init-db || true
```

#### Step 12: Push and Deploy

```bash
git add .github/workflows/ci-cd.yml
git commit -m "Configure auto-deployment"
git push
```

The workflow will automatically deploy on push to main/master branch.

---

## Part 4: Nginx Configuration (Your Other App)

Since Nginx is running on another app, configure it to proxy to this container:

### Step 18: Configure Nginx Reverse Proxy

Add this to your Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your IP

    location / {
        proxy_pass http://adex-app:3000;  # Container name on raheed_default network
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

**Important:** Use `adex-app` (container name) instead of `localhost` since both are on `raheed_default` network.

### Step 19: Reload Nginx

```bash
# Test configuration
nginx -t

# Reload Nginx
nginx -s reload
# or
systemctl reload nginx
```

---

## Part 5: Post-Deployment

### Step 20: Verify Everything Works

1. **Access via Nginx:**
   - Open: `http://your-domain.com` or `http://your-server-ip`

2. **Test admin panel:**
   - `http://your-domain.com/admin/login`

3. **Test API:**
   ```bash
   curl http://your-domain.com/api/contacts
   ```

### Step 21: Set Up Monitoring (Optional)

```bash
# View logs
docker-compose logs -f app

# Check container health
docker-compose ps

# Monitor resource usage
docker stats
```

### Step 22: Set Up Backups

Create a backup script:

```bash
# backup.sh
#!/bin/bash
BACKUP_DIR="/backups/adex"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose exec -T mysql mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ./public/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make it executable and add to crontab:
```bash
chmod +x backup.sh
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app

# Check if port is in use
netstat -tulpn | grep 3000

# Restart containers
docker-compose restart
```

### Can't connect to database
```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker-compose exec app node -e "require('./src/lib/db.js').connectDB()"
```

### Network issues
```bash
# Check network exists
docker network ls

# Inspect network
docker network inspect raheed_default

# Recreate network connection
docker-compose down
docker-compose up -d
```

### GitHub Actions failing
- Check Actions tab for error messages
- Verify secrets are set correctly
- Check Docker build logs
- Ensure workflow file syntax is correct

---

## Quick Reference Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart app
docker-compose restart app

# Update and rebuild
docker-compose pull
docker-compose up -d --build

# Execute commands in container
docker-compose exec app npm run init-db

# Check container status
docker-compose ps

# View network
docker network inspect raheed_default
```

---

## Next Steps

- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log aggregation
- [ ] Set up automated backups
- [ ] Review security settings
- [ ] Performance optimization

---

## Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose exec app env | grep DB_`
3. Check network: `docker network inspect raheed_default`
4. Review this tutorial step by step

**Congratulations! 🎉 Your app should now be published and running!**

