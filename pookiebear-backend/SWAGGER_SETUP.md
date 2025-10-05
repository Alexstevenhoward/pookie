# 📚 Swagger API Documentation Setup

## Overview
Swagger provides interactive API documentation that developers can use to explore and test endpoints.

## Installation

```bash
cd pookiebear-backend
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

## Setup

### 1. Create Swagger Configuration

Create `src/config/swagger.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PookieBear API',
      version: '1.0.0',
      description: 'Dog care management platform API',
      contact: {
        name: 'PookieBear Support',
        email: 'support@pookiebear.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://staging-api.pookiebear.com/api/v1',
        description: 'Staging server'
      },
      {
        url: 'https://api.pookiebear.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/entities/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 2. Add to Express App

In `src/app.ts`:

```typescript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// ... existing code ...

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PookieBear API Docs'
}));

// Optional: Serve swagger spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

console.log('📚 Swagger docs available at http://localhost:3000/api-docs');

// ... rest of app.ts ...
```

### 3. Document Routes with JSDoc

Example for auth routes (`src/routes/authRoutes.ts`):

```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/register', registerValidation, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, login);
```

### 4. Document Schemas

In entity files (`src/entities/User.ts`):

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *         profilePhotoUrl:
 *           type: string
 *           nullable: true
 *         subscriptionTier:
 *           type: string
 *           enum: [free, premium, family]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
@Entity()
export class User {
  // ... entity definition
}
```

### 5. Document Dog Routes Example

```typescript
/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Get all dogs for authenticated user
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's dogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dog'
 *       401:
 *         description: Not authenticated
 *   post:
 *     summary: Create a new dog
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DogInput'
 *     responses:
 *       201:
 *         description: Dog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dog'
 */
```

## Accessing Swagger UI

After setup:

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000/api-docs`
3. You'll see interactive API documentation
4. Can test endpoints directly from the UI!

## Features

- **Interactive Testing:** Test API calls directly from browser
- **Authentication:** Click "Authorize" and enter JWT token
- **Request/Response Examples:** Auto-generated from schemas
- **Try It Out:** Execute real API calls
- **Download Spec:** Get OpenAPI JSON spec

## Tags for Organization

Use tags to group related endpoints:

- **Authentication** - Register, login, logout, refresh
- **Dogs** - Dog CRUD operations
- **Activities** - Activity tracking
- **Health** - Health records, vaccinations, medications
- **Community** - Posts, comments, likes
- **Reminders** - Reminder management

## Best Practices

### ✅ Do's
- Document all public endpoints
- Include request/response examples
- Use proper HTTP status codes
- Group endpoints with tags
- Document authentication requirements
- Include validation rules

### ❌ Don'ts
- Don't leave endpoints undocumented
- Don't duplicate schema definitions
- Don't forget error responses
- Don't skip authentication documentation

## Progressive Documentation

You don't need to document everything at once:

1. **Start:** Document authentication endpoints
2. **Next:** Document most-used endpoints (dogs, activities)
3. **Then:** Fill in remaining endpoints
4. **Last:** Add detailed schemas and examples

## Alternative: Postman

If you prefer Postman:
- Export OpenAPI spec: `GET /api-docs.json`
- Import into Postman
- Auto-generates Postman collection

## Current Status

- ✅ API Reference exists in `API_REFERENCE.md`
- ⏳ Swagger not yet installed
- ⏳ Routes not yet annotated

This is fine for MVP! Add Swagger before opening API to external developers.

## Quick Start Commands

```bash
# Install
npm install swagger-ui-express swagger-jsdoc

# Create config
touch src/config/swagger.ts

# Update app.ts
# (add swagger middleware)

# Start server
npm run dev

# Access docs
open http://localhost:3000/api-docs
```

## Example: Complete Auth Documentation

See `API_REFERENCE.md` for complete API documentation. Swagger would make this interactive and testable from the browser!
