# Backend API Documentation

This Next.js application includes a complete backend API built with Sequelize ORM and MySQL database.

## Database Setup

### Installation

The required dependencies are already installed:
- `sequelize` - ORM for database operations
- `mysql2` - MySQL database driver
- `dotenv` - Environment variable management

### Configuration

1. **Set up MySQL Database:**
   - Install MySQL server on your system
   - Create a database for the application:
   ```sql
   CREATE DATABASE adex_db;
   ```

2. **Create a `.env` file** in the root directory:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adex_db
DB_USER=root
DB_PASSWORD=your_password

# Environment
NODE_ENV=development

# Alternative: Use DATABASE_URL connection string
# DATABASE_URL=mysql://user:password@localhost:3306/adex_db
```

3. **Initialize the database:**
```bash
npm run init-db
```

The database tables will be created automatically when you first run the application or the init script.

## Database Models

### Contact Model
Stores contact form submissions with JSON data fields:
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `company` - Company name (optional)
- `message` - Message content
- `formData` - JSON field storing all form data
- `metadata` - JSON field for additional metadata
- `status` - Status of the contact (default: 'new')
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Service Model
Stores service information with JSON data:
- `id` - Primary key
- `title` - Service title
- `subtitle` - Service subtitle
- `description` - Service description
- `icon` - Icon name
- `capabilities` - JSON array of capabilities
- `serviceData` - JSON field storing all service data
- `metadata` - JSON field for additional metadata
- `order` - Display order
- `isActive` - Active status
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Content Model
Generic content storage with JSON data:
- `id` - Primary key
- `key` - Unique content key
- `type` - Content type
- `data` - JSON field storing all content data
- `metadata` - JSON field for additional metadata
- `isActive` - Active status
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## API Endpoints

### Contacts API

#### GET `/api/contacts`
Fetch all contacts with optional filters.

**Query Parameters:**
- `status` - Filter by status
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 10,
  "limit": 50,
  "offset": 0
}
```

#### POST `/api/contacts`
Create a new contact submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "Hello, I need help...",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "message": "Hello, I need help..."
  },
  "metadata": {
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Contact created successfully"
}
```

#### GET `/api/contacts/[id]`
Get a specific contact by ID.

#### PUT `/api/contacts/[id]`
Update a contact.

**Request Body:**
```json
{
  "status": "read",
  "metadata": {
    "readAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE `/api/contacts/[id]`
Delete a contact.

### Services API

#### GET `/api/services`
Fetch all services.

**Query Parameters:**
- `isActive` - Filter by active status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

#### POST `/api/services`
Create a new service.

**Request Body:**
```json
{
  "title": "Strategy Consulting",
  "subtitle": "Define Your Competitive Edge",
  "description": "Service description...",
  "icon": "TrendingUp",
  "capabilities": ["Capability 1", "Capability 2"],
  "serviceData": {
    "title": "Strategy Consulting",
    "subtitle": "Define Your Competitive Edge",
    "description": "Service description...",
    "icon": "TrendingUp",
    "capabilities": ["Capability 1", "Capability 2"]
  },
  "order": 1,
  "isActive": true
}
```

#### GET `/api/services/[id]`
Get a specific service by ID.

#### PUT `/api/services/[id]`
Update a service.

#### DELETE `/api/services/[id]`
Delete a service.

### Content API

#### GET `/api/content`
Fetch all content items.

**Query Parameters:**
- `key` - Filter by content key
- `type` - Filter by content type
- `isActive` - Filter by active status

#### POST `/api/content`
Create or update content (upsert by key).

**Request Body:**
```json
{
  "key": "hero-section",
  "type": "section",
  "data": {
    "title": "Welcome",
    "description": "Description here"
  },
  "metadata": {
    "version": 1
  }
}
```

#### GET `/api/content/[key]`
Get content by key.

#### PUT `/api/content/[key]`
Update content by key.

#### DELETE `/api/content/[key]`
Delete content by key.

## JSON Data Storage

All models support JSON data storage through Sequelize's `JSON` data type. This allows you to:

1. Store flexible, schema-less data
2. Query JSON fields
3. Update nested JSON properties
4. Store arrays and complex objects

### Example: Storing JSON Data

```javascript
// Create contact with JSON data
const contact = await Contact.create({
  name: "John Doe",
  email: "john@example.com",
  message: "Hello",
  formData: {
    name: "John Doe",
    email: "john@example.com",
    message: "Hello",
    customField: "value"
  },
  metadata: {
    source: "website",
    campaign: "summer-2024",
    tags: ["lead", "enterprise"]
  }
});

// Update JSON data
contact.metadata.tags.push("follow-up");
await contact.save();
```

## Database Connection

The database connection is automatically initialized when API routes are accessed. The connection is lazy-loaded and cached to avoid multiple initializations.

## Development

### Running the Development Server

```bash
npm run dev
```

The API routes will be available at:
- `http://localhost:3000/api/contacts`
- `http://localhost:3000/api/services`
- `http://localhost:3000/api/content`

### Database Connection

The application uses MySQL as the database. Make sure MySQL is running and accessible with the credentials provided in your `.env` file.

**Connection Options:**
- Use individual parameters: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Or use connection string: `DATABASE_URL=mysql://user:password@host:port/database`

## Production Considerations

For production, consider:

1. **Environment Variables**: Use proper environment variable management (never commit `.env` files)
2. **Database Migrations**: Use Sequelize migrations instead of `sync({ alter: true })` for production
3. **Connection Pooling**: Already configured with connection pooling for better performance
4. **Error Handling**: Add comprehensive error handling and logging
5. **Validation**: Add input validation and sanitization
6. **Authentication**: Add authentication/authorization for admin endpoints
7. **SSL/TLS**: Enable SSL connections for production MySQL databases
8. **Backup Strategy**: Implement regular database backups
9. **Monitoring**: Set up database monitoring and alerting

### Production Database Configuration

For production, update your `.env` with production credentials:

```env
DB_HOST=your-production-host
DB_PORT=3306
DB_NAME=adex_db_prod
DB_USER=your_prod_user
DB_PASSWORD=your_secure_password
NODE_ENV=production
```

Or use a connection string:
```env
DATABASE_URL=mysql://user:password@host:3306/database?ssl=true
```

