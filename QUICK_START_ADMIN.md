# Quick Start Guide - Admin Dashboard

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

1. Make sure MySQL is running
2. Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adex_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Admin User (optional - defaults provided)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@adex.com
ADMIN_PASSWORD=admin123
```

3. Initialize the database:

```bash
npm run init-db
```

## Step 3: Create Admin User

```bash
npm run create-admin
```

This will create an admin user with:
- Username: `admin` (or your ADMIN_USERNAME)
- Email: `admin@adex.com` (or your ADMIN_EMAIL)
- Password: `admin123` (or your ADMIN_PASSWORD)

**⚠️ Change the default password after first login!**

## Step 4: Start the Server

```bash
npm run dev
```

## Step 5: Access the Dashboard

1. Open your browser and go to:
   ```
   http://localhost:3000/admin/login
   ```

2. Log in with your admin credentials

3. Start managing your content!

## What You Can Do

### ✅ Edit All Website Content
- Home page sections (Hero, About, Services, etc.)
- About page content
- Services page content
- Contact page content

### ✅ Manage Services
- Create new services
- Edit existing services
- Delete services
- Set display order
- Activate/deactivate services

### ✅ Manage Contacts
- View all contact form submissions
- Update contact status
- Delete contacts
- View detailed contact information

## Troubleshooting

### Can't Login?
- Make sure you ran `npm run create-admin`
- Check your database connection
- Verify JWT_SECRET is set in `.env`

### Content Not Saving?
- Check browser console for errors
- Verify you're logged in
- Check database connection

### Need Help?
See `ADMIN_DASHBOARD.md` for detailed documentation.





