# Pookie Bear Backend - Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- A terminal/command line

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Using psql command line
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pookiebear_db;

# Exit
\q
```

#### Option B: Using createdb command
```bash
createdb pookiebear_db
```

#### Option C: Using a GUI tool
- Download and install [pgAdmin](https://www.pgadmin.org/) or [Postico](https://eggerapps.at/postico/)
- Connect to PostgreSQL
- Create a new database named `pookiebear_db`

### 3. Configure Environment Variables

The `.env` file is already created with default values. If you need to change database credentials:

```bash
# Edit .env file
nano .env

# Update these lines if needed:
DB_USERNAME=postgres       # Your PostgreSQL username
DB_PASSWORD=postgres       # Your PostgreSQL password
DB_DATABASE=pookiebear_db  # Database name
```

### 4. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

### 5. Test the API

Open another terminal and test the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "uptime": 1.234
}
```

## Testing Authentication

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response for authenticated requests.

### Create a dog profile
```bash
curl -X POST http://localhost:3000/api/v1/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Max",
    "breed": "Golden Retriever",
    "dateOfBirth": "2020-05-15",
    "gender": "male",
    "weightLbs": 65.5,
    "neuteredSpayed": true
  }'
```

## Troubleshooting

### "Database connection failed"
- Make sure PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Verify database exists: `psql -l` (look for pookiebear_db)

### "Port 3000 is already in use"
- Change the PORT in `.env` file to another port (e.g., 3001)
- Or stop the process using port 3000

### "JWT_SECRET not defined"
- The `.env` file should already have JWT secrets defined
- If not, make sure `.env` exists and contains JWT_SECRET and JWT_REFRESH_SECRET

## Database Schema

The database schema will be automatically created when you start the server (auto-sync enabled in development).

Tables created:
- `users` - User accounts and authentication
- `dogs` - Dog profiles
- `vet_visits` - Veterinary visit records
- `vaccinations` - Vaccination records
- `medications` - Medication tracking
- `allergies` - Allergy information
- `activities` - Activity and walk tracking
- `feeding_logs` - Feeding history
- `grooming_logs` - Grooming history
- `posts` - Community posts
- `comments` - Post comments
- `likes` - Post likes

## Production Deployment

For production deployment:

1. **Disable auto-sync** in [src/config/database.ts](src/config/database.ts):
   ```typescript
   synchronize: false  // Change from true to false
   ```

2. **Use migrations** instead of auto-sync:
   ```bash
   npm run migration:generate -- src/migrations/InitialSchema
   npm run migration:run
   ```

3. **Set strong JWT secrets** in production `.env`

4. **Use environment-specific configurations**

5. **Enable SSL for database connection**

6. **Set up proper logging and monitoring**

## Next Steps

- Read the full [README.md](README.md) for complete API documentation
- Explore all API endpoints
- Set up Twilio for SMS verification (optional)
- Configure AWS S3 for photo uploads (optional)
- Add your frontend application

## Need Help?

- Check the [README.md](README.md) for full documentation
- Review the [API endpoints](README.md#api-documentation)
- Inspect the code in `src/` directory