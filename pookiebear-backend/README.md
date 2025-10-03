# Pookie Bear Backend API

RESTful API backend service for the Pookie Bear dog care management iOS application.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: AWS S3
- **SMS**: Twilio (for phone verification)

## Features

- ✅ User authentication (Email/Password, Phone/SMS)
- ✅ Dog profile management (CRUD operations)
- ✅ Health records tracking (vet visits, vaccinations, medications, allergies)
- ✅ Activity tracking (walks with GPS, manual activities)
- ✅ Activity statistics and analytics
- ✅ RESTful API design
- ✅ JWT-based authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Request compression

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

1. **Clone the repository**
```bash
cd pookiebear-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb pookiebear_db

# Or using psql
psql -U postgres
CREATE DATABASE pookiebear_db;
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run database migrations** (auto-sync is enabled in development)
```bash
npm run dev
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on http://localhost:3000 with hot-reload enabled.

### Production Mode
```bash
npm run build
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register with Email
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+15555555555"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Send SMS Code
```http
POST /api/v1/auth/send-code
Content-Type: application/json

{
  "phoneNumber": "+15555555555"
}
```

#### Verify SMS Code
```http
POST /api/v1/auth/verify-code
Content-Type: application/json

{
  "phoneNumber": "+15555555555",
  "code": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Dog Profile Endpoints

All endpoints require `Authorization: Bearer <access_token>` header.

#### Get All Dogs
```http
GET /api/v1/dogs
```

#### Get Dog by ID
```http
GET /api/v1/dogs/:id
```

#### Create Dog
```http
POST /api/v1/dogs
Content-Type: application/json

{
  "name": "Max",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-05-15",
  "gender": "male",
  "weightLbs": 65.5,
  "neuteredSpayed": true,
  "microchipId": "123456789",
  "coatColor": "Golden",
  "energyLevel": "high"
}
```

#### Update Dog
```http
PATCH /api/v1/dogs/:id
Content-Type: application/json

{
  "weightLbs": 67.0,
  "energyLevel": "moderate"
}
```

#### Delete Dog (Archive)
```http
DELETE /api/v1/dogs/:id
```

### Health Records Endpoints

#### Get Vet Visits
```http
GET /api/v1/health/:dogId/visits
```

#### Create Vet Visit
```http
POST /api/v1/health/:dogId/visits
Content-Type: application/json

{
  "visitDate": "2024-01-15",
  "visitType": "wellness",
  "reason": "Annual checkup",
  "diagnosis": "Healthy",
  "cost": 150.00,
  "vetNotes": "All vitals normal"
}
```

#### Get Vaccinations
```http
GET /api/v1/health/:dogId/vaccinations
```

#### Create Vaccination
```http
POST /api/v1/health/:dogId/vaccinations
Content-Type: application/json

{
  "vaccineType": "Rabies",
  "vaccineName": "Nobivac Rabies",
  "administrationDate": "2024-01-15",
  "nextDueDate": "2025-01-15",
  "administeredBy": "Dr. Smith"
}
```

#### Get Medications
```http
GET /api/v1/health/:dogId/medications
```

#### Get Allergies
```http
GET /api/v1/health/:dogId/allergies
```

### Activity Tracking Endpoints

#### Get Activities
```http
GET /api/v1/activities/:dogId?startDate=2024-01-01&endDate=2024-01-31&type=walk
```

#### Create Walk (GPS Tracking)
```http
POST /api/v1/activities/:dogId/walks
Content-Type: application/json

{
  "startTime": "2024-01-15T08:00:00Z",
  "endTime": "2024-01-15T08:30:00Z",
  "durationSeconds": 1800,
  "distanceMeters": 2414,
  "averagePace": 12.4,
  "routePolyline": "encoded_polyline_string",
  "routeCoordinates": [
    {"latitude": 40.7128, "longitude": -74.0060},
    {"latitude": 40.7138, "longitude": -74.0070}
  ],
  "caloriesBurned": 150,
  "temperatureFahrenheit": 65.5
}
```

#### Create Manual Activity
```http
POST /api/v1/activities/:dogId
Content-Type: application/json

{
  "activityType": "playtime",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:30:00Z",
  "durationSeconds": 1800,
  "intensity": "moderate",
  "location": "Dog Park",
  "notes": "Played fetch"
}
```

#### Get Activity Statistics
```http
GET /api/v1/activities/:dogId/stats?period=week
```

Response:
```json
{
  "period": "week",
  "stats": {
    "totalActivities": 12,
    "totalDistanceMeters": 15000,
    "totalDistanceMiles": 9.32,
    "totalDurationMinutes": 360,
    "totalCalories": 1200,
    "walkCount": 8,
    "averageWalkDistanceMeters": 1875,
    "averageWalkDistanceMiles": 1.165
  }
}
```

## Database Schema

### Users
- User authentication and profile information
- Supports email/password and phone authentication
- Subscription tier tracking

### Dogs
- Complete dog profile with breed, age, weight
- Microchip tracking
- Photo storage (URLs)
- Health and behavior attributes

### Health Records
- **Vet Visits**: Complete visit history with diagnoses and costs
- **Vaccinations**: Track all vaccinations with due dates
- **Medications**: Active and historical medication tracking
- **Allergies**: Allergy information with severity levels

### Activities
- GPS walk tracking with route data
- Manual activity logging
- Duration, distance, and calorie tracking
- Activity statistics and analytics

## Project Structure

```
pookiebear-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # TypeORM configuration
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── dogController.ts     # Dog management
│   │   ├── healthController.ts  # Health records
│   │   └── activityController.ts # Activity tracking
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Dog.ts
│   │   ├── VetVisit.ts
│   │   ├── Vaccination.ts
│   │   ├── Medication.ts
│   │   ├── Allergy.ts
│   │   ├── Activity.ts
│   │   ├── FeedingLog.ts
│   │   ├── GroomingLog.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   └── Like.ts
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── dogRoutes.ts
│   │   ├── healthRoutes.ts
│   │   └── activityRoutes.ts
│   ├── utils/
│   │   └── jwt.ts               # JWT utilities
│   └── app.ts                   # Main application file
├── .env                         # Environment variables
├── .env.example                 # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 15-minute expiry for access tokens
- Refresh tokens with 30-day expiry
- Helmet.js for security headers
- Input validation with express-validator
- CORS configuration
- Environment variables for sensitive data

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Testing

Health check endpoint:
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "uptime": 123.456
}
```

## Future Enhancements

- [ ] WebSocket support for real-time features
- [ ] Community features (posts, comments, likes)
- [ ] Emergency vet finder with geolocation
- [ ] Pet insurance integration
- [ ] File upload to AWS S3
- [ ] Email notifications
- [ ] SMS notifications via Twilio
- [ ] Redis caching
- [ ] Rate limiting
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## License

Proprietary - All rights reserved

## Contact

For questions or support, please contact the development team.