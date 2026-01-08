# Deployment Guide

This guide explains how to deploy the ADEX application using Docker Compose and GitHub Actions CI/CD.

## Prerequisites

- Docker and Docker Compose installed
- GitHub repository with Actions enabled
- Server/VM for deployment (if deploying manually)

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your production values:

```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=adex_db
DB_USER=adex_user
DB_PASSWORD=your-secure-password
DB_ROOT_PASSWORD=your-secure-root-password
NODE_ENV=production
APP_PORT=3000
JWT_SECRET=your-super-secret-jwt-key
```

**Important:** Never commit `.env` files to version control!

### 2. Local Development with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

The application will be available at `http://localhost:3000`

### 3. Initialize Database

After starting the containers, initialize the database:

```bash
# Run database initialization
docker-compose exec app npm run init-db

# Create admin user
docker-compose exec app npm run create-admin
```

### 4. Production Deployment

#### Option A: Using Docker Compose (Recommended for single server)

```bash
# Use production override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or build and start
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### Option B: Using GitHub Container Registry

The CI/CD pipeline automatically builds and pushes images to GitHub Container Registry.

1. **Pull the latest image:**
   ```bash
   docker pull ghcr.io/your-username/your-repo:latest
   ```

2. **Run with docker-compose:**
   Update `docker-compose.yml` to use the image:
   ```yaml
   services:
     app:
       image: ghcr.io/your-username/your-repo:latest
       # Remove build section
   ```

## GitHub Actions CI/CD

### Workflow Overview

The CI/CD pipeline (`/.github/workflows/ci-cd.yml`) includes:

1. **Build and Test Job:**
   - Checks out code
   - Sets up Node.js
   - Installs dependencies
   - Runs linter (if available)
   - Builds the application
   - Runs tests (if available)

2. **Build Docker Image Job:**
   - Builds Docker image
   - Pushes to GitHub Container Registry
   - Only runs on push to main/master branches

3. **Deploy Job:**
   - Placeholder for deployment steps
   - Customize based on your deployment target

### Setting Up GitHub Actions

1. **Enable GitHub Actions** in your repository settings

2. **Configure Secrets** (if deploying automatically):
   - Go to Settings → Secrets and variables → Actions
   - Add secrets:
     - `HOST`: Your server IP/hostname
     - `USERNAME`: SSH username
     - `SSH_KEY`: Private SSH key
     - `DEPLOYMENT_URL`: Your application URL

3. **Customize Deployment Step:**
   
   Edit `.github/workflows/ci-cd.yml` and uncomment/modify the deployment section:

   ```yaml
   - name: Deploy via SSH
     uses: appleboy/ssh-action@master
     with:
       host: ${{ secrets.HOST }}
       username: ${{ secrets.USERNAME }}
       key: ${{ secrets.SSH_KEY }}
       script: |
         cd /path/to/app
         docker-compose pull
         docker-compose up -d
   ```

### Manual Deployment with GitHub Actions

If you prefer manual deployment:

1. Build and push image automatically via CI/CD
2. SSH into your server
3. Pull the latest image:
   ```bash
   docker pull ghcr.io/your-username/your-repo:latest
   ```
4. Restart containers:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Nginx Reverse Proxy Setup

Since Nginx is running on another app, configure it to proxy requests to this container:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Important:** In production, remove the port mapping from `docker-compose.yml` or use `docker-compose.prod.yml` to keep the app internal to Docker network.

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Database Backup

```bash
# Backup MySQL database
docker-compose exec mysql mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} > backup.sql

# Restore from backup
docker-compose exec -T mysql mysql -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} < backup.sql
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# Or if using pre-built images
docker-compose pull
docker-compose up -d
```

### Health Checks

The MySQL service includes health checks. Check container health:

```bash
docker-compose ps
```

## Troubleshooting

### Database Connection Issues

1. Ensure MySQL container is healthy:
   ```bash
   docker-compose ps mysql
   ```

2. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

3. Verify environment variables:
   ```bash
   docker-compose exec app env | grep DB_
   ```

### Application Won't Start

1. Check application logs:
   ```bash
   docker-compose logs app
   ```

2. Verify build succeeded:
   ```bash
   docker-compose build app
   ```

3. Check port conflicts:
   ```bash
   netstat -tulpn | grep 3000
   ```

### Volume Permissions

If uploads directory has permission issues:

```bash
sudo chown -R 1001:1001 ./public/uploads
```

## Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT_SECRET** (generate with `openssl rand -base64 32`)
3. **Limit database access** - use non-root user for application
4. **Enable SSL/TLS** for MySQL connections in production
5. **Use secrets management** (Docker secrets, AWS Secrets Manager, etc.)
6. **Keep images updated** - regularly update base images and dependencies
7. **Use firewall rules** - restrict database port access

## Production Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configure proper database credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure Nginx reverse proxy
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up health checks
- [ ] Review and update security settings
- [ ] Test deployment process
- [ ] Document deployment procedures

