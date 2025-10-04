# 🔌 API Reference - PookieBear Backend
## Complete REST API Documentation

**Base URL:** `http://localhost:3000/api/v1` (development)
**Production URL:** `https://api.pookiebear.com/api/v1` (when deployed)
**Version:** v1
**Authentication:** JWT Bearer Token

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Dogs](#dogs)
3. [Health Records](#health-records)
4. [Activities](#activities)
5. [Community](#community)
6. [Feeding & Grooming](#feeding--grooming)
7. [Error Responses](#error-responses)
8. [Data Models](#data-models)

---

## 🔐 Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`
**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"  // Optional
}
```

**Validation Rules:**
- `email`: Required, must be valid email format
- `password`: Required, minimum 8 characters
- `firstName`: Required
- `lastName`: Required
- `phoneNumber`: Optional, valid phone format

**Success Response:** `201 Created`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "isPhoneVerified": false,
    "profilePhotoUrl": null,
    "subscriptionTier": "free",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input or email already exists
- `500 Internal Server Error`: Server error

---

### Login

Authenticate user and receive access token.

**Endpoint:** `POST /auth/login`
**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePhotoUrl": null,
    "subscriptionTier": "free"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing required fields

---

### Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /auth/refresh`
**Authentication:** None required

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Expiry:**
- Access Token: 15 minutes
- Refresh Token: 30 days

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

### Send SMS Verification Code

Send verification code to user's phone number.

**Endpoint:** `POST /auth/send-code`
**Authentication:** Bearer Token required

**Request Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "SMS code sent successfully",
  "expiresIn": 300  // seconds
}
```

**Note:** In development, SMS not actually sent (Twilio not configured). Code stored in memory.

---

### Verify SMS Code

Verify the SMS code sent to user's phone.

**Endpoint:** `POST /auth/verify-code`
**Authentication:** Bearer Token required

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "code": "123456"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Phone number verified successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isPhoneVerified": true
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired code
- `401 Unauthorized`: Not authenticated

---

### Logout

Invalidate refresh token (client should delete stored tokens).

**Endpoint:** `POST /auth/logout`
**Authentication:** None required (client-side action)

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## 🐕 Dogs

All dog endpoints require authentication via Bearer token in `Authorization` header.

### Get All Dogs

Retrieve all dogs for authenticated user.

**Endpoint:** `GET /dogs`
**Authentication:** Required

**Query Parameters:** None

**Success Response:** `200 OK`
```json
[
  {
    "id": "dog-uuid-1",
    "userId": "user-uuid",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "dateOfBirth": "2020-05-15",
    "gender": "male",
    "weight": 65.5,
    "profilePhotoUrl": "https://s3.amazonaws.com/pookiebear/dogs/buddy-profile.jpg",
    "additionalPhotos": [
      "https://s3.amazonaws.com/pookiebear/dogs/buddy-1.jpg",
      "https://s3.amazonaws.com/pookiebear/dogs/buddy-2.jpg"
    ],
    "coatColor": "Golden",
    "coatType": "long",
    "microchipId": "985112345678901",
    "microchipRegistry": "AKC Reunite",
    "isNeutered": true,
    "energyLevel": "high",
    "temperamentTags": ["friendly", "playful", "gentle"],
    "specialNeeds": null,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "dog-uuid-2",
    "name": "Luna",
    "breed": "Labrador",
    "dateOfBirth": "2019-03-20",
    "gender": "female",
    "weight": 55.0,
    // ... other fields
  }
]
```

**Empty State:** Returns `[]` if user has no dogs.

---

### Get Dog by ID

Retrieve specific dog details.

**Endpoint:** `GET /dogs/:id`
**Authentication:** Required

**URL Parameters:**
- `id` (string, required): Dog UUID

**Success Response:** `200 OK`
```json
{
  "id": "dog-uuid-1",
  "userId": "user-uuid",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-05-15",
  "gender": "male",
  "weight": 65.5,
  "profilePhotoUrl": "https://s3.amazonaws.com/...",
  "additionalPhotos": ["https://s3.amazonaws.com/..."],
  "coatColor": "Golden",
  "coatType": "long",
  "microchipId": "985112345678901",
  "microchipRegistry": "AKC Reunite",
  "isNeutered": true,
  "energyLevel": "high",
  "temperamentTags": ["friendly", "playful"],
  "specialNeeds": null,
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Dog not found or doesn't belong to user
- `401 Unauthorized`: Not authenticated

---

### Create Dog

Add a new dog to user's profile.

**Endpoint:** `POST /dogs`
**Authentication:** Required

**Request Body:**
```json
{
  "name": "Buddy",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-05-15",
  "gender": "male",
  "weight": 65.5,  // Optional
  "profilePhotoUrl": "https://s3.amazonaws.com/...",  // Optional
  "additionalPhotos": ["https://..."],  // Optional
  "coatColor": "Golden",  // Optional
  "coatType": "long",  // Optional
  "microchipId": "985112345678901",  // Optional
  "microchipRegistry": "AKC Reunite",  // Optional
  "isNeutered": true,  // Optional
  "energyLevel": "high",  // Optional: low, medium, high, very_high
  "temperamentTags": ["friendly", "playful"],  // Optional
  "specialNeeds": null  // Optional
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `breed`: Required, 1-100 characters
- `dateOfBirth`: Required, ISO date format (YYYY-MM-DD)
- `gender`: Required, one of: "male", "female", "unknown"
- `weight`: Optional, positive number
- `energyLevel`: Optional, one of: "low", "medium", "high", "very_high"
- `temperamentTags`: Optional, array of strings

**Success Response:** `201 Created`
```json
{
  "id": "new-dog-uuid",
  "userId": "user-uuid",
  "name": "Buddy",
  "breed": "Golden Retriever",
  // ... all fields including defaults
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Not authenticated

---

### Update Dog

Update dog information.

**Endpoint:** `PATCH /dogs/:id`
**Authentication:** Required

**URL Parameters:**
- `id` (string, required): Dog UUID

**Request Body:** (all fields optional)
```json
{
  "name": "Buddy Updated",
  "weight": 67.0,
  "temperamentTags": ["friendly", "playful", "loyal"]
}
```

**Success Response:** `200 OK`
```json
{
  "id": "dog-uuid",
  "name": "Buddy Updated",
  "weight": 67.0,
  "temperamentTags": ["friendly", "playful", "loyal"],
  // ... all other fields
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Dog not found or doesn't belong to user
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Not authenticated

---

### Delete Dog

Remove a dog from user's profile (soft delete).

**Endpoint:** `DELETE /dogs/:id`
**Authentication:** Required

**URL Parameters:**
- `id` (string, required): Dog UUID

**Success Response:** `200 OK`
```json
{
  "message": "Dog deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Dog not found or doesn't belong to user
- `401 Unauthorized`: Not authenticated

---

### Add Dog Photo

Add photo to dog's profile (requires S3 setup - not yet implemented).

**Endpoint:** `POST /dogs/:id/photos`
**Authentication:** Required

**URL Parameters:**
- `id` (string, required): Dog UUID

**Request Body:** (multipart/form-data)
```
photo: [file]
type: "profile" | "additional"
```

**Success Response:** `200 OK`
```json
{
  "photoUrl": "https://s3.amazonaws.com/pookiebear/dogs/buddy-new.jpg",
  "message": "Photo uploaded successfully"
}
```

**Status:** ⚠️ Not yet implemented (S3 integration pending)

---

## 🏥 Health Records

All health endpoints require authentication.

### Veterinary Visits

#### Get All Vet Visits

**Endpoint:** `GET /health/:dogId/visits`
**Authentication:** Required

**URL Parameters:**
- `dogId` (string, required): Dog UUID

**Success Response:** `200 OK`
```json
[
  {
    "id": "visit-uuid-1",
    "dogId": "dog-uuid",
    "visitDate": "2024-01-10T14:30:00.000Z",
    "vetClinicName": "Happy Paws Veterinary Clinic",
    "vetClinicAddress": "123 Main St, City, State 12345",
    "visitType": "routine_checkup",
    "reason": "Annual wellness exam",
    "diagnosis": "Healthy, no issues found",
    "treatment": "Vaccinations updated, teeth cleaning",
    "procedures": ["dental_cleaning", "vaccination"],
    "testResults": "Blood work normal, heartworm negative",
    "medications": "Prescribed: Heartgard Plus monthly",
    "cost": 250.00,
    "nextVisitDate": "2025-01-10",
    "notes": "Schedule dental in 6 months",
    "attachments": ["https://s3.amazonaws.com/..."],
    "createdAt": "2024-01-10T15:00:00.000Z",
    "updatedAt": "2024-01-10T15:00:00.000Z"
  }
]
```

**Visit Types:**
- `routine_checkup`
- `emergency`
- `surgery`
- `dental`
- `vaccination`
- `follow_up`
- `other`

---

#### Create Vet Visit

**Endpoint:** `POST /health/:dogId/visits`
**Authentication:** Required

**Request Body:**
```json
{
  "visitDate": "2024-01-10T14:30:00.000Z",
  "vetClinicName": "Happy Paws Veterinary Clinic",
  "vetClinicAddress": "123 Main St, City, State",  // Optional
  "visitType": "routine_checkup",
  "reason": "Annual wellness exam",  // Optional
  "diagnosis": "Healthy",  // Optional
  "treatment": "Vaccinations",  // Optional
  "procedures": ["vaccination"],  // Optional
  "testResults": "All normal",  // Optional
  "medications": "Heartgard",  // Optional
  "cost": 250.00,  // Optional
  "nextVisitDate": "2025-01-10",  // Optional
  "notes": "Everything looks good",  // Optional
  "attachments": []  // Optional
}
```

**Success Response:** `201 Created`
```json
{
  "id": "new-visit-uuid",
  "dogId": "dog-uuid",
  // ... all fields
  "createdAt": "2024-01-10T15:00:00.000Z"
}
```

---

#### Update Vet Visit

**Endpoint:** `PATCH /health/:dogId/visits/:visitId`
**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "notes": "Updated notes",
  "cost": 275.00
}
```

**Success Response:** `200 OK`

---

### Vaccinations

#### Get All Vaccinations

**Endpoint:** `GET /health/:dogId/vaccinations`
**Authentication:** Required

**Success Response:** `200 OK`
```json
[
  {
    "id": "vacc-uuid-1",
    "dogId": "dog-uuid",
    "vaccineName": "Rabies",
    "dateAdministered": "2024-01-10",
    "expirationDate": "2027-01-10",
    "vetClinicName": "Happy Paws Veterinary Clinic",
    "lotNumber": "LOT12345",
    "certificateNumber": "CERT98765",
    "notes": "3-year rabies vaccine",
    "attachments": ["https://s3.amazonaws.com/cert.pdf"],
    "createdAt": "2024-01-10T15:00:00.000Z",
    "updatedAt": "2024-01-10T15:00:00.000Z"
  },
  {
    "id": "vacc-uuid-2",
    "vaccineName": "DHPP",
    "dateAdministered": "2024-01-10",
    "expirationDate": "2025-01-10",
    // ... other fields
  }
]
```

---

#### Create Vaccination

**Endpoint:** `POST /health/:dogId/vaccinations`
**Authentication:** Required

**Request Body:**
```json
{
  "vaccineName": "Rabies",
  "dateAdministered": "2024-01-10",
  "expirationDate": "2027-01-10",  // Optional
  "vetClinicName": "Happy Paws Veterinary Clinic",  // Optional
  "lotNumber": "LOT12345",  // Optional
  "certificateNumber": "CERT98765",  // Optional
  "notes": "3-year vaccine",  // Optional
  "attachments": []  // Optional
}
```

**Success Response:** `201 Created`

---

### Medications

#### Get All Medications

**Endpoint:** `GET /health/:dogId/medications`
**Authentication:** Required

**Success Response:** `200 OK`
```json
[
  {
    "id": "med-uuid-1",
    "dogId": "dog-uuid",
    "medicationName": "Heartgard Plus",
    "dosage": "51-100 lbs tablet",
    "frequency": "Once monthly",
    "startDate": "2024-01-01",
    "endDate": null,
    "isActive": true,
    "prescribingVet": "Dr. Smith",
    "instructions": "Give with food",
    "refillReminder": "2024-06-01",
    "notes": "Heartworm prevention",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

---

#### Create Medication

**Endpoint:** `POST /health/:dogId/medications`
**Authentication:** Required

**Request Body:**
```json
{
  "medicationName": "Heartgard Plus",
  "dosage": "51-100 lbs tablet",
  "frequency": "Once monthly",
  "startDate": "2024-01-01",
  "endDate": null,  // Optional, null for ongoing
  "isActive": true,  // Default true
  "prescribingVet": "Dr. Smith",  // Optional
  "instructions": "Give with food",  // Optional
  "refillReminder": "2024-06-01",  // Optional
  "notes": "Heartworm prevention"  // Optional
}
```

**Success Response:** `201 Created`

---

### Allergies

#### Get All Allergies

**Endpoint:** `GET /health/:dogId/allergies`
**Authentication:** Required

**Success Response:** `200 OK`
```json
[
  {
    "id": "allergy-uuid-1",
    "dogId": "dog-uuid",
    "allergen": "Chicken",
    "severity": "moderate",
    "symptoms": "Skin rash, itching",
    "treatment": "Avoid chicken-based foods, antihistamine if exposed",
    "notes": "Developed at age 2",
    "createdAt": "2023-05-15T10:00:00.000Z",
    "updatedAt": "2023-05-15T10:00:00.000Z"
  }
]
```

**Severity Levels:**
- `mild`
- `moderate`
- `severe`

---

#### Create Allergy

**Endpoint:** `POST /health/:dogId/allergies`
**Authentication:** Required

**Request Body:**
```json
{
  "allergen": "Chicken",
  "severity": "moderate",
  "symptoms": "Skin rash, itching",  // Optional
  "treatment": "Avoid chicken",  // Optional
  "notes": "Developed recently"  // Optional
}
```

**Success Response:** `201 Created`

---

## 🏃 Activities

All activity endpoints require authentication.

### Get All Activities

Retrieve activity history for a dog.

**Endpoint:** `GET /activities/:dogId`
**Authentication:** Required

**URL Parameters:**
- `dogId` (string, required): Dog UUID

**Query Parameters:**
- `limit` (number, optional): Max activities to return (default: 100)
- `offset` (number, optional): Pagination offset (default: 0)
- `startDate` (string, optional): Filter activities after this date (ISO format)
- `endDate` (string, optional): Filter activities before this date

**Success Response:** `200 OK`
```json
[
  {
    "id": "activity-uuid-1",
    "dogId": "dog-uuid",
    "activityType": "walk",
    "startTime": "2024-01-15T08:00:00.000Z",
    "endTime": "2024-01-15T08:45:00.000Z",
    "duration": 45,  // minutes
    "distance": 2.5,  // miles
    "location": "Central Park",
    "route": {
      "type": "LineString",
      "coordinates": [
        [-73.968285, 40.785091],
        [-73.967123, 40.786456],
        // ... more coordinates
      ]
    },
    "pace": "17:58",  // min/mile
    "caloriesBurned": 180,
    "intensity": "moderate",
    "notes": "Great walk, lots of sniffing!",
    "photos": ["https://s3.amazonaws.com/walk-1.jpg"],
    "weather": "Sunny, 72°F",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T09:00:00.000Z"
  },
  {
    "id": "activity-uuid-2",
    "activityType": "playtime",
    "startTime": "2024-01-14T16:00:00.000Z",
    "endTime": "2024-01-14T16:30:00.000Z",
    "duration": 30,
    "location": "Backyard",
    "intensity": "high",
    "notes": "Fetch with tennis ball",
    // ... other fields
  }
]
```

**Activity Types:**
- `walk`
- `playtime`
- `training`
- `swimming`
- `fetch`
- `park_visit`
- `daycare`
- `hiking`

**Intensity Levels:**
- `low`
- `moderate`
- `high`

---

### Create Walk (GPS Tracking)

Log a walk with GPS route data.

**Endpoint:** `POST /activities/:dogId/walks`
**Authentication:** Required

**Request Body:**
```json
{
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T08:45:00.000Z",
  "duration": 45,
  "distance": 2.5,
  "route": {
    "type": "LineString",
    "coordinates": [
      [-73.968285, 40.785091],
      [-73.967123, 40.786456]
    ]
  },
  "location": "Central Park",  // Optional
  "pace": "17:58",  // Optional (auto-calculated if not provided)
  "caloriesBurned": 180,  // Optional
  "intensity": "moderate",  // Optional
  "notes": "Great walk!",  // Optional
  "photos": [],  // Optional
  "weather": "Sunny, 72°F"  // Optional
}
```

**Success Response:** `201 Created`
```json
{
  "id": "new-activity-uuid",
  "dogId": "dog-uuid",
  "activityType": "walk",
  // ... all fields
  "createdAt": "2024-01-15T09:00:00.000Z"
}
```

---

### Create Activity

Log any type of activity (non-walk).

**Endpoint:** `POST /activities/:dogId`
**Authentication:** Required

**Request Body:**
```json
{
  "activityType": "playtime",
  "startTime": "2024-01-14T16:00:00.000Z",
  "endTime": "2024-01-14T16:30:00.000Z",
  "duration": 30,
  "location": "Backyard",  // Optional
  "intensity": "high",  // Optional
  "notes": "Fetch with tennis ball",  // Optional
  "photos": []  // Optional
}
```

**Success Response:** `201 Created`

---

### Update Activity

**Endpoint:** `PATCH /activities/:dogId/:activityId`
**Authentication:** Required

**Request Body:** (all fields optional)
```json
{
  "notes": "Updated notes",
  "intensity": "high"
}
```

**Success Response:** `200 OK`

---

### Delete Activity

**Endpoint:** `DELETE /activities/:dogId/:activityId`
**Authentication:** Required

**Success Response:** `200 OK`
```json
{
  "message": "Activity deleted successfully"
}
```

---

### Get Activity Statistics

Get aggregated activity stats for a dog.

**Endpoint:** `GET /activities/:dogId/stats`
**Authentication:** Required

**Query Parameters:**
- `period` (string, optional): "week", "month", "year" (default: "month")
- `startDate` (string, optional): Custom date range start
- `endDate` (string, optional): Custom date range end

**Success Response:** `200 OK`
```json
{
  "period": "month",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "totalActivities": 28,
  "totalDistance": 45.5,  // miles
  "totalDuration": 1260,  // minutes (21 hours)
  "totalCalories": 3780,
  "averageDistance": 1.63,
  "averageDuration": 45,
  "activitiesByType": {
    "walk": 20,
    "playtime": 5,
    "training": 2,
    "fetch": 1
  },
  "activitiesByIntensity": {
    "low": 8,
    "moderate": 15,
    "high": 5
  },
  "longestWalk": {
    "id": "activity-uuid",
    "distance": 5.2,
    "duration": 78,
    "date": "2024-01-20"
  },
  "mostActiveDay": {
    "date": "2024-01-15",
    "activities": 3,
    "totalDistance": 6.5
  }
}
```

---

## 👥 Community (Backend Ready)

**Status:** ⚠️ Endpoints exist but not documented in detail yet. iOS UI not implemented.

### Available Endpoints (Not Fully Implemented)
- `GET /community/posts/feed` - Get community feed
- `POST /community/posts` - Create post
- `POST /community/posts/:id/like` - Like post
- `POST /community/posts/:id/comments` - Add comment

**Note:** Community features are in database schema but need full backend implementation and iOS UI.

---

## 🍖 Feeding & Grooming

**Status:** ⚠️ Entities exist in database but no controllers/routes yet.

### Planned Endpoints (Not Yet Implemented)

**Feeding:**
- `GET /feeding/:dogId` - Get feeding logs
- `POST /feeding/:dogId` - Create feeding log

**Grooming:**
- `GET /grooming/:dogId` - Get grooming logs
- `POST /grooming/:dogId` - Create grooming log

---

## ❌ Error Responses

All errors follow this format:

### Standard Error Response
```json
{
  "error": "Error message describing what went wrong",
  "statusCode": 400
}
```

### Validation Error Response
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "statusCode": 400
}
```

### Common HTTP Status Codes

| Code | Meaning | When it occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error |

---

## 📊 Data Models

### User
```typescript
{
  id: string;  // UUID
  email: string;
  password: string;  // Hashed, never returned in responses
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  profilePhotoUrl?: string;
  subscriptionTier: 'free' | 'premium' | 'family';
  createdAt: Date;
  updatedAt: Date;
}
```

### Dog
```typescript
{
  id: string;  // UUID
  userId: string;  // FK to User
  name: string;
  breed: string;
  dateOfBirth: string;  // ISO date
  gender: 'male' | 'female' | 'unknown';
  weight?: number;
  profilePhotoUrl?: string;
  additionalPhotos?: string[];
  coatColor?: string;
  coatType?: string;
  microchipId?: string;
  microchipRegistry?: string;
  isNeutered?: boolean;
  energyLevel?: 'low' | 'medium' | 'high' | 'very_high';
  temperamentTags?: string[];
  specialNeeds?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity
```typescript
{
  id: string;  // UUID
  dogId: string;  // FK to Dog
  activityType: 'walk' | 'playtime' | 'training' | 'swimming' | 'fetch' | 'park_visit' | 'daycare' | 'hiking';
  startTime: Date;
  endTime?: Date;
  duration: number;  // minutes
  distance?: number;  // miles
  location?: string;
  route?: GeoJSON;  // For GPS walks
  pace?: string;  // min/mile
  caloriesBurned?: number;
  intensity?: 'low' | 'moderate' | 'high';
  notes?: string;
  photos?: string[];
  weather?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### VetVisit
```typescript
{
  id: string;
  dogId: string;
  visitDate: Date;
  vetClinicName: string;
  vetClinicAddress?: string;
  visitType: 'routine_checkup' | 'emergency' | 'surgery' | 'dental' | 'vaccination' | 'follow_up' | 'other';
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  procedures?: string[];
  testResults?: string;
  medications?: string;
  cost?: number;
  nextVisitDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Vaccination
```typescript
{
  id: string;
  dogId: string;
  vaccineName: string;
  dateAdministered: string;
  expirationDate?: string;
  vetClinicName?: string;
  lotNumber?: string;
  certificateNumber?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Medication
```typescript
{
  id: string;
  dogId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  prescribingVet?: string;
  instructions?: string;
  refillReminder?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Allergy
```typescript
{
  id: string;
  dogId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms?: string;
  treatment?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔧 Development Notes

### Authentication Flow

1. User registers/logs in → Receives access token (15 min) + refresh token (30 days)
2. Store both tokens securely (iOS Keychain, Android EncryptedSharedPreferences)
3. Include access token in all requests: `Authorization: Bearer {accessToken}`
4. When access token expires (401 response):
   - Call `/auth/refresh` with refresh token
   - Get new access token
   - Retry original request
5. If refresh token expires → Force logout, redirect to login

### Rate Limiting

**Not currently implemented** - Should add before production:
- Authentication endpoints: 5 requests/minute per IP
- API endpoints: 100 requests/minute per user
- File uploads: 10 uploads/hour per user

### Pagination

**Not fully implemented** - Activities endpoint has basic limit/offset:
```
GET /activities/:dogId?limit=20&offset=0
```

**Recommendation:** Implement cursor-based pagination for production.

### File Uploads

**Status:** ⚠️ S3 integration planned but not implemented.

**When implemented:**
1. Client requests upload URL from backend
2. Backend generates signed S3 upload URL
3. Client uploads directly to S3
4. Client sends S3 URL back to backend to associate with record

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Real-time notifications (Socket.io ready)
- [ ] Reminder system (push notifications)
- [ ] Community feed (database ready)
- [ ] Search & filtering
- [ ] Batch operations
- [ ] Export data (PDF reports)
- [ ] Third-party integrations (vet records import)

### API Versioning
- Current: `/api/v1/`
- Future versions will be `/api/v2/`, etc.
- v1 will be maintained for backwards compatibility

---

## 📞 Support

**Issues:** Report at [GitHub Issues](https://github.com/Alexstevenhoward/pookie/issues)
**Questions:** Email support@pookiebear.com (when live)

---

**Last Updated:** January 2025
**API Version:** 1.0
**Status:** Development (MVP in progress)
