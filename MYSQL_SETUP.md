# MySQL Setup Guide

## Quick Start

### 1. Install MySQL

**Windows:**
- Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run the installer and follow the setup wizard
- Remember the root password you set during installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database

Connect to MySQL:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE adex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adex_db
DB_USER=root
DB_PASSWORD=your_mysql_root_password

# Environment
NODE_ENV=development
```

**Or use a connection string:**
```env
DATABASE_URL=mysql://root:your_password@localhost:3306/adex_db
NODE_ENV=development
```

### 4. Initialize Database

Run the initialization script:
```bash
npm run init-db
```

This will:
- Connect to your MySQL database
- Create all necessary tables
- Seed initial service data

### 5. Start Development Server

```bash
npm run dev
```

The API will automatically connect to MySQL when you make your first API call.

## Troubleshooting

### Connection Refused
- Make sure MySQL server is running
- Check that the port (default 3306) is correct
- Verify firewall settings allow connections

### Access Denied
- Verify your MySQL username and password
- Check if the user has permissions to access the database
- Try creating a new MySQL user:
  ```sql
  CREATE USER 'adex_user'@'localhost' IDENTIFIED BY 'your_password';
  GRANT ALL PRIVILEGES ON adex_db.* TO 'adex_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Database Doesn't Exist
- Make sure you created the database (step 2)
- Verify the database name in `.env` matches the created database

### JSON Column Support
MySQL 5.7.8+ supports native JSON data type. If you're using an older version, Sequelize will use TEXT type with JSON parsing.

## Production Setup

For production, use a dedicated MySQL user with limited privileges:

```sql
CREATE USER 'adex_prod'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON adex_db.* TO 'adex_prod'@'localhost';
FLUSH PRIVILEGES;
```

Update your production `.env`:
```env
DB_HOST=your_production_host
DB_PORT=3306
DB_NAME=adex_db
DB_USER=adex_prod
DB_PASSWORD=strong_password
NODE_ENV=production
```

## Connection Pooling

The configuration includes connection pooling:
- **max**: 5 connections
- **min**: 0 connections
- **acquire**: 30 seconds timeout
- **idle**: 10 seconds before closing idle connections

Adjust these values in `src/lib/db.js` based on your application's needs.





