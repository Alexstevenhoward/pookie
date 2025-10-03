# API Testing Guide

This guide provides copy-paste ready curl commands to test all API endpoints.

## Prerequisites

1. Start the server: `npm run dev`
2. Server should be running on `http://localhost:3000`

## Variables Setup

For easier testing, set these variables in your terminal:

```bash
export API_URL="http://localhost:3000/api/v1"
export TOKEN="" # Will be set after login
```

---

## 1. Authentication Tests

### Register New User
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+15555551234"
  }'
```

### Login
```bash
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the accessToken from the response:**
```bash
export TOKEN="paste_your_access_token_here"
```

### Send SMS Code
```bash
curl -X POST $API_URL/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+15555551234"
  }'
```

### Verify SMS Code
```bash
# Check server console for the code
curl -X POST $API_URL/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+15555551234",
    "code": "123456",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

## 2. Dog Profile Tests

### Create Dog Profile
```bash
curl -X POST $API_URL/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Max",
    "breed": "Golden Retriever",
    "dateOfBirth": "2020-05-15",
    "gender": "male",
    "weightLbs": 65.5,
    "neuteredSpayed": true,
    "microchipId": "123456789012345",
    "coatColor": "Golden",
    "coatType": "long",
    "energyLevel": "high",
    "temperamentTags": ["friendly", "energetic", "playful"],
    "specialNeeds": "None"
  }'
```

**Save the dog ID from the response:**
```bash
export DOG_ID="paste_dog_id_here"
```

### Get All Dogs
```bash
curl -X GET $API_URL/dogs \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Dog
```bash
curl -X GET $API_URL/dogs/$DOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update Dog
```bash
curl -X PATCH $API_URL/dogs/$DOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "weightLbs": 67.0,
    "energyLevel": "moderate"
  }'
```

### Add Photo
```bash
curl -X POST $API_URL/dogs/$DOG_ID/photos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "photoUrl": "https://example.com/photos/max-profile.jpg"
  }'
```

---

## 3. Health Records Tests

### Create Vet Visit
```bash
curl -X POST $API_URL/health/$DOG_ID/visits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "visitDate": "2024-01-15",
    "visitType": "wellness",
    "reason": "Annual checkup",
    "diagnosis": "Healthy - all vitals normal",
    "vetNotes": "Weight is good, coat looks healthy, teeth clean",
    "cost": 150.00,
    "followUpRequired": false
  }'
```

### Get Vet Visits
```bash
curl -X GET $API_URL/health/$DOG_ID/visits \
  -H "Authorization: Bearer $TOKEN"
```

### Create Vaccination
```bash
curl -X POST $API_URL/health/$DOG_ID/vaccinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "vaccineType": "Rabies",
    "vaccineName": "Nobivac Rabies",
    "administrationDate": "2024-01-15",
    "expirationDate": "2027-01-15",
    "nextDueDate": "2027-01-15",
    "administeredBy": "Dr. Sarah Johnson",
    "lotNumber": "LOT123456"
  }'
```

### Get Vaccinations
```bash
curl -X GET $API_URL/health/$DOG_ID/vaccinations \
  -H "Authorization: Bearer $TOKEN"
```

### Create Medication
```bash
curl -X POST $API_URL/health/$DOG_ID/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "medicationName": "Apoquel",
    "dosage": "16mg",
    "frequency": "Twice daily",
    "startDate": "2024-01-15",
    "endDate": "2024-02-15",
    "prescribingVet": "Dr. Sarah Johnson",
    "purpose": "Allergy relief",
    "active": true
  }'
```

### Get Medications
```bash
curl -X GET $API_URL/health/$DOG_ID/medications \
  -H "Authorization: Bearer $TOKEN"
```

### Create Allergy
```bash
curl -X POST $API_URL/health/$DOG_ID/allergies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "allergen": "Chicken",
    "allergyType": "food",
    "severity": "moderate",
    "symptoms": "Itching, red skin, ear infections",
    "diagnosedDate": "2023-06-10",
    "diagnosedBy": "Dr. Sarah Johnson",
    "notes": "Switched to fish-based food"
  }'
```

### Get Allergies
```bash
curl -X GET $API_URL/health/$DOG_ID/allergies \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Activity Tracking Tests

### Create GPS Walk
```bash
curl -X POST $API_URL/activities/$DOG_ID/walks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "startTime": "2024-01-15T08:00:00Z",
    "endTime": "2024-01-15T08:30:00Z",
    "durationSeconds": 1800,
    "distanceMeters": 2414,
    "averagePace": 12.4,
    "routePolyline": "encoded_polyline_string_here",
    "routeCoordinates": [
      {"latitude": 40.7128, "longitude": -74.0060},
      {"latitude": 40.7138, "longitude": -74.0070},
      {"latitude": 40.7148, "longitude": -74.0080}
    ],
    "caloriesBurned": 150,
    "steps": 3200,
    "temperatureFahrenheit": 65.5,
    "weatherConditions": {
      "condition": "Sunny",
      "humidity": 60
    },
    "notes": "Great walk in the park!"
  }'
```

### Create Manual Activity
```bash
curl -X POST $API_URL/activities/$DOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "activityType": "playtime",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "durationSeconds": 1800,
    "intensity": "moderate",
    "location": "Dog Park on 5th Ave",
    "notes": "Played fetch with other dogs"
  }'
```

### Get Activities
```bash
# All activities
curl -X GET "$API_URL/activities/$DOG_ID" \
  -H "Authorization: Bearer $TOKEN"

# Filter by date range
curl -X GET "$API_URL/activities/$DOG_ID?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"

# Filter by type
curl -X GET "$API_URL/activities/$DOG_ID?type=walk" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Activity Statistics
```bash
# Daily stats
curl -X GET "$API_URL/activities/$DOG_ID/stats?period=day" \
  -H "Authorization: Bearer $TOKEN"

# Weekly stats
curl -X GET "$API_URL/activities/$DOG_ID/stats?period=week" \
  -H "Authorization: Bearer $TOKEN"

# Monthly stats
curl -X GET "$API_URL/activities/$DOG_ID/stats?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Error Testing

### Test Invalid Token
```bash
curl -X GET $API_URL/dogs \
  -H "Authorization: Bearer invalid_token"
```

Expected: 403 Forbidden

### Test Missing Token
```bash
curl -X GET $API_URL/dogs
```

Expected: 401 Unauthorized

### Test Invalid Dog ID
```bash
curl -X GET $API_URL/dogs/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 404 Not Found

### Test Validation Error
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short"
  }'
```

Expected: 400 Bad Request with validation errors

---

## 6. Advanced Testing Scenarios

### Create Multiple Dogs
```bash
# Dog 2
curl -X POST $API_URL/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Luna",
    "breed": "Labrador Retriever",
    "dateOfBirth": "2021-03-20",
    "gender": "female",
    "weightLbs": 55.0,
    "neuteredSpayed": true,
    "energyLevel": "very_high"
  }'

# Dog 3
curl -X POST $API_URL/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Charlie",
    "breed": "Beagle",
    "dateOfBirth": "2019-11-05",
    "gender": "male",
    "weightLbs": 28.5,
    "neuteredSpayed": false,
    "energyLevel": "moderate"
  }'
```

### Create Activity History
```bash
# Walk 1
curl -X POST $API_URL/activities/$DOG_ID/walks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "startTime": "2024-01-14T07:00:00Z",
    "endTime": "2024-01-14T07:45:00Z",
    "durationSeconds": 2700,
    "distanceMeters": 3200,
    "caloriesBurned": 180
  }'

# Walk 2
curl -X POST $API_URL/activities/$DOG_ID/walks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "startTime": "2024-01-13T08:00:00Z",
    "endTime": "2024-01-13T08:20:00Z",
    "durationSeconds": 1200,
    "distanceMeters": 1600,
    "caloriesBurned": 90
  }'
```

---

## Testing Workflow

### Complete Test Flow
```bash
# 1. Register
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# 2. Login and save token
# ... login and export TOKEN=...

# 3. Create dog and save ID
# ... create dog and export DOG_ID=...

# 4. Add health records
# ... add vaccination, medication, allergy

# 5. Log activities
# ... add some walks

# 6. Check statistics
curl -X GET "$API_URL/activities/$DOG_ID/stats?period=week" \
  -H "Authorization: Bearer $TOKEN"

# 7. View complete profile
curl -X GET $API_URL/dogs/$DOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Using Postman

1. Import this collection: Create a new collection in Postman
2. Set environment variables:
   - `api_url`: http://localhost:3000/api/v1
   - `token`: (will be set after login)
   - `dog_id`: (will be set after creating dog)
3. Use {{api_url}}, {{token}}, {{dog_id}} in requests

---

## Response Examples

### Successful Login Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "subscriptionTier": "free"
  }
}
```

### Activity Stats Response
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

---

## Troubleshooting

### "Invalid or expired token"
- Token might have expired (15-minute lifetime)
- Login again to get a new token

### "Dog not found"
- Check that you're using the correct DOG_ID
- Verify the dog belongs to the authenticated user

### "Access token required"
- Make sure you're including the Authorization header
- Check that TOKEN variable is set correctly

---

## Performance Testing

### Load Test with Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/health

# Test authenticated endpoint (requires token)
ab -n 100 -c 5 -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/dogs
```

---

## Next Steps

After testing the API:
1. Build the iOS Swift application
2. Integrate with this backend
3. Add more advanced features (insurance, community, etc.)
4. Set up production deployment