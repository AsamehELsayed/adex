# Admin Dashboard Documentation

## Overview

The Admin Dashboard provides a comprehensive content management system (CMS) that allows you to control every line of text and content on your website. You can manage all pages, sections, services, and contacts from a single interface.

## Setup

### 1. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 2. Create Admin User

After setting up your database, create the first admin user:

```bash
npm run create-admin
```

**Default Credentials:**
- Username: `admin`
- Email: `admin@adex.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default password immediately after first login!

You can customize the admin credentials by setting environment variables:

```env
ADMIN_USERNAME=your_username
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
```

### 3. Access the Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin login page:
   ```
   http://localhost:3000/admin/login
   ```

3. Log in with your admin credentials

## Features

### Home Page Management

Edit all sections of the home page:

- **Hero Section**: Main banner with title, description, and call-to-action buttons
- **About Section**: Company overview with statistics
- **Services Section**: Featured services grid
- **Why Choose Us Section**: Key differentiators with statistics
- **Call-to-Action Section**: Final conversion section

### Page Management

#### About Page
- Hero section content
- Company story and history
- Core values
- CTA section

#### Services Page
- Hero section
- Individual service details (managed separately)
- CTA section

#### Contact Page
- Hero section
- Contact form labels and text
- Contact information (address, email, phone, hours)

### Services Management

Create, edit, and delete services:

- **Title & Subtitle**: Service name and tagline
- **Description**: Detailed service description
- **Icon**: Lucide icon name (e.g., "TrendingUp", "Settings")
- **Capabilities**: List of service capabilities
- **Order**: Display order (lower numbers appear first)
- **Active Status**: Show/hide service

### Contacts Management

View and manage contact form submissions:

- View all contact submissions
- Update status (New, Read, Replied)
- View detailed contact information
- Delete contacts
- Filter and search contacts

## Content Management

### How Content is Stored

All content is stored in the database using the `Content` model with a key-value structure:

- **Key**: Unique identifier (e.g., "hero-section", "about-page")
- **Type**: Content type (e.g., "section", "page")
- **Data**: JSON object containing all content fields
- **Metadata**: Additional metadata (optional)

### Editing Content

1. Navigate to the appropriate tab in the dashboard
2. Find the section you want to edit
3. Modify the text fields
4. Click "Save Changes"
5. The changes are immediately saved to the database

### Content Keys Reference

| Key | Description |
|-----|-------------|
| `hero-section` | Home page hero section |
| `about-section` | Home page about section |
| `services-section` | Home page services section |
| `why-choose-us-section` | Home page why choose us section |
| `cta-section` | Home page CTA section |
| `about-page` | About page content |
| `services-page` | Services page content |
| `contact-page` | Contact page content |

## Security

### Authentication

- JWT-based authentication
- Secure HTTP-only cookies
- Password hashing with bcrypt
- Session management

### Access Control

- All admin routes are protected by middleware
- Only authenticated users can access the dashboard
- Automatic redirect to login if not authenticated

### Environment Variables

Add to your `.env` file:

```env
# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin User (optional, defaults provided)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@adex.com
ADMIN_PASSWORD=admin123
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Content

- `GET /api/content?key=<key>` - Get content by key
- `POST /api/content` - Create or update content

### Services

- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

### Contacts

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/[id]` - Get contact by ID
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

## Frontend Integration

To make your frontend components use the CMS content, you'll need to:

1. Fetch content from the API in your components
2. Use the content data instead of hardcoded text
3. Handle loading states and fallbacks

Example:

```javascript
const [content, setContent] = useState(null);

useEffect(() => {
  fetch('/api/content?key=hero-section')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        setContent(data.data[0].data);
      }
    });
}, []);

// Use content in your component
{content ? (
  <h1>{content.title}</h1>
) : (
  <h1>Default Title</h1>
)}
```

## Troubleshooting

### Can't Login

1. Make sure you've created an admin user: `npm run create-admin`
2. Check your database connection
3. Verify JWT_SECRET is set in `.env`
4. Clear browser cookies and try again

### Content Not Saving

1. Check browser console for errors
2. Verify database connection
3. Check API response in Network tab
4. Ensure you're logged in

### Services Not Appearing

1. Check if services are marked as "Active"
2. Verify the order field is set correctly
3. Check database for service records
4. Refresh the page

## Best Practices

1. **Backup Before Changes**: Always backup your database before making major content changes
2. **Test Changes**: Preview changes before publishing
3. **Use Version Control**: Consider versioning your content changes
4. **Regular Backups**: Set up regular database backups
5. **Strong Passwords**: Use strong passwords for admin accounts
6. **Change Defaults**: Always change default admin credentials

## Support

For issues or questions:
1. Check the console for error messages
2. Review the API responses in Network tab
3. Check database logs
4. Verify all environment variables are set correctly





