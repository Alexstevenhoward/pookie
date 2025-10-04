# 🧪 Testing Strategy - Professional Mobile App Development

**Goal:** Ensure production-ready quality through comprehensive testing
**Target:** 70%+ backend coverage, 60%+ iOS coverage
**Philosophy:** Test behavior, not implementation. Fast, reliable, maintainable tests.

---

## 📋 Testing Pyramid

```
         /\
        /E2E\        ← Few, critical user journeys
       /______\
      /        \
     / Integration \   ← API + Service layer
    /______________\
   /                \
  /   Unit Tests     \  ← Most tests here
 /____________________\
```

### Distribution
- **70% Unit Tests** - Fast, focused, test single functions/classes
- **20% Integration Tests** - API endpoints, service interactions
- **10% E2E/UI Tests** - Critical user flows

---

## 🔧 Backend Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Configure Jest
npx ts-jest config:init
```

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Unit Tests

**What to Test:**
- ✅ JWT utility functions (sign, verify, refresh)
- ✅ Validation functions
- ✅ Data transformation functions
- ✅ Error handling logic
- ✅ Business logic calculations (stats, scores)

**Example: JWT Utils Test**

**File:** `src/__tests__/utils/jwt.test.ts`

```typescript
import { generateToken, verifyToken, generateRefreshToken } from '../../utils/jwt';

describe('JWT Utilities', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'Test'
  };

  describe('generateToken', () => {
    it('should generate a valid access token', () => {
      const token = generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include user data in token payload', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
    });

    it('should expire after 15 minutes', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      const expiryTime = decoded.exp! * 1000;
      const expectedExpiry = Date.now() + (15 * 60 * 1000);
      expect(expiryTime).toBeCloseTo(expectedExpiry, -3); // Within seconds
    });
  });

  describe('verifyToken', () => {
    it('should verify valid tokens', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.id);
    });

    it('should throw on invalid tokens', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw on expired tokens', () => {
      // Mock token with past expiry
      const expiredToken = generateToken(mockUser, '0s');
      setTimeout(() => {
        expect(() => verifyToken(expiredToken)).toThrow();
      }, 100);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with 30-day expiry', () => {
      const refreshToken = generateRefreshToken(mockUser);
      expect(refreshToken).toBeDefined();
      const decoded = verifyToken(refreshToken);
      const expiryTime = decoded.exp! * 1000;
      const expectedExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
      expect(expiryTime).toBeCloseTo(expectedExpiry, -5);
    });
  });
});
```

### Integration Tests (API)

**What to Test:**
- ✅ All API endpoints (200, 400, 401, 404, 500 responses)
- ✅ Authentication flow
- ✅ CRUD operations
- ✅ Query parameters and filtering
- ✅ Error responses
- ✅ Validation rules

**Setup Test Database:**

**File:** `src/__tests__/setup.ts`

```typescript
import { DataSource } from 'typeorm';
import { dataSource } from '../config/database';

let testDataSource: DataSource;

export const setupTestDB = async () => {
  testDataSource = new DataSource({
    ...dataSource.options,
    database: 'pookiebear_test', // Separate test database
    synchronize: true, // Auto-create schema
    dropSchema: true, // Fresh database each run
  });

  await testDataSource.initialize();
  return testDataSource;
};

export const teardownTestDB = async () => {
  if (testDataSource?.isInitialized) {
    await testDataSource.destroy();
  }
};

// Run before all tests
beforeAll(async () => {
  await setupTestDB();
});

// Run after all tests
afterAll(async () => {
  await teardownTestDB();
});

// Clear tables before each test
beforeEach(async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  }
});
```

**Example: Authentication API Test**

**File:** `src/__tests__/api/auth.test.ts`

```typescript
import request from 'supertest';
import app from '../../app';
import { setupTestDB, teardownTestDB } from '../setup';

describe('Authentication API', () => {
  beforeAll(setupTestDB);
  afterAll(teardownTestDB);

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'DifferentPass123!',
          firstName: 'Jane',
          lastName: 'Smith'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should require password minimum length', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const testUser = {
      email: 'login@example.com',
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User'
    };

    beforeEach(async () => {
      // Create user for login tests
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'refresh@example.com',
          password: 'SecurePass123!',
          firstName: 'Refresh',
          lastName: 'Test'
        });
      refreshToken = response.body.refreshToken;
    });

    it('should refresh access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });
});
```

**Example: Dog API Test**

**File:** `src/__tests__/api/dogs.test.ts`

```typescript
import request from 'supertest';
import app from '../../app';
import { setupTestDB, teardownTestDB } from '../setup';

describe('Dogs API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(setupTestDB);
  afterAll(teardownTestDB);

  beforeEach(async () => {
    // Create and login user
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'dogowner@example.com',
        password: 'SecurePass123!',
        firstName: 'Dog',
        lastName: 'Owner'
      });
    authToken = response.body.accessToken;
    userId = response.body.user.id;
  });

  describe('POST /api/v1/dogs', () => {
    it('should create a new dog', async () => {
      const dogData = {
        name: 'Buddy',
        breed: 'Golden Retriever',
        dateOfBirth: '2020-05-15',
        gender: 'male',
        weight: 30.5,
        coatColor: 'Golden',
        isNeutered: true
      };

      const response = await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dogData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(dogData.name);
      expect(response.body.breed).toBe(dogData.breed);
      expect(response.body.userId).toBe(userId);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/dogs')
        .send({ name: 'Buddy', breed: 'Golden Retriever' });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Buddy' }); // Missing required breed

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/dogs', () => {
    beforeEach(async () => {
      // Create test dogs
      await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Dog1', breed: 'Breed1', dateOfBirth: '2020-01-01', gender: 'male' });

      await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Dog2', breed: 'Breed2', dateOfBirth: '2021-01-01', gender: 'female' });
    });

    it('should get all user dogs', async () => {
      const response = await request(app)
        .get('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBeDefined();
    });

    it('should only return authenticated user dogs', async () => {
      // Create another user
      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'otheruser@example.com',
          password: 'SecurePass123!',
          firstName: 'Other',
          lastName: 'User'
        });

      // Should only see own dogs
      const response = await request(app)
        .get('/api/v1/dogs')
        .set('Authorization', `Bearer ${otherUserResponse.body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PUT /api/v1/dogs/:id', () => {
    let dogId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Original', breed: 'Breed', dateOfBirth: '2020-01-01', gender: 'male' });
      dogId = response.body.id;
    });

    it('should update dog', async () => {
      const response = await request(app)
        .put(`/api/v1/dogs/${dogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should not update other user\'s dog', async () => {
      // Create another user
      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'hacker@example.com',
          password: 'SecurePass123!',
          firstName: 'Hacker',
          lastName: 'User'
        });

      const response = await request(app)
        .put(`/api/v1/dogs/${dogId}`)
        .set('Authorization', `Bearer ${otherUserResponse.body.accessToken}`)
        .send({ name: 'Hacked Name' });

      expect(response.status).toBe(404); // Or 403 Forbidden
    });
  });

  describe('DELETE /api/v1/dogs/:id', () => {
    let dogId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'ToDelete', breed: 'Breed', dateOfBirth: '2020-01-01', gender: 'male' });
      dogId = response.body.id;
    });

    it('should delete dog', async () => {
      const response = await request(app)
        .delete(`/api/v1/dogs/${dogId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify deletion
      const getResponse = await request(app)
        .get('/api/v1/dogs')
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.body).toHaveLength(0);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode (during development)
npm test -- --watch

# Run specific test file
npm test -- dogs.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"
```

---

## 📱 iOS Testing

### Setup

**XCTest** is built-in, no installation needed.

**Test Target:** `PookieBearTests` (already exists)

### Unit Tests

**What to Test:**
- ✅ ViewModels (business logic, state management)
- ✅ Services (APIClient, AuthenticationManager)
- ✅ Game logic (MatchDetectionService, ScoreCalculationService, GridGenerationService)
- ✅ Data models (Codable encoding/decoding)
- ✅ Utilities (date formatters, validators)

**Example: ViewModel Test**

**File:** `PookieBearTests/ViewModels/DogsListViewModelTests.swift`

```swift
import XCTest
import Combine
@testable import PookieBear

class DogsListViewModelTests: XCTestCase {
    var viewModel: DogsListViewModel!
    var mockAPIClient: MockAPIClient!
    var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        mockAPIClient = MockAPIClient()
        viewModel = DogsListViewModel(apiClient: mockAPIClient)
        cancellables = []
    }

    override func tearDown() {
        viewModel = nil
        mockAPIClient = nil
        cancellables = nil
        super.tearDown()
    }

    func testFetchDogsSuccess() {
        // Given
        let expectedDogs = [
            Dog(id: "1", name: "Buddy", breed: "Golden Retriever", dateOfBirth: "2020-01-01", gender: "male"),
            Dog(id: "2", name: "Max", breed: "Labrador", dateOfBirth: "2019-05-15", gender: "male")
        ]
        mockAPIClient.dogsToReturn = expectedDogs

        let expectation = XCTestExpectation(description: "Dogs fetched")

        // When
        viewModel.$dogs
            .dropFirst() // Skip initial empty value
            .sink { dogs in
                // Then
                XCTAssertEqual(dogs.count, 2)
                XCTAssertEqual(dogs[0].name, "Buddy")
                XCTAssertEqual(dogs[1].name, "Max")
                expectation.fulfill()
            }
            .store(in: &cancellables)

        viewModel.fetchDogs()

        wait(for: [expectation], timeout: 1.0)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testFetchDogsFailure() {
        // Given
        mockAPIClient.shouldThrowError = true
        mockAPIClient.errorToThrow = APIError.unauthorized

        let expectation = XCTestExpectation(description: "Error handled")

        // When
        viewModel.$errorMessage
            .dropFirst()
            .sink { error in
                // Then
                XCTAssertNotNil(error)
                XCTAssertTrue(error?.contains("unauthorized") ?? false)
                expectation.fulfill()
            }
            .store(in: &cancellables)

        viewModel.fetchDogs()

        wait(for: [expectation], timeout: 1.0)
        XCTAssertFalse(viewModel.isLoading)
    }

    func testCreateDogSuccess() async {
        // Given
        let newDog = Dog(id: "", name: "Charlie", breed: "Beagle", dateOfBirth: "2021-03-10", gender: "male")
        mockAPIClient.dogToReturn = Dog(id: "3", name: "Charlie", breed: "Beagle", dateOfBirth: "2021-03-10", gender: "male")

        // When
        await viewModel.createDog(newDog)

        // Then
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNil(viewModel.errorMessage)
        XCTAssertTrue(mockAPIClient.createDogCalled)
    }

    func testDeleteDogSuccess() async {
        // Given
        viewModel.dogs = [
            Dog(id: "1", name: "Buddy", breed: "Golden Retriever", dateOfBirth: "2020-01-01", gender: "male"),
            Dog(id: "2", name: "Max", breed: "Labrador", dateOfBirth: "2019-05-15", gender: "male")
        ]

        // When
        await viewModel.deleteDog(id: "1")

        // Then
        XCTAssertEqual(viewModel.dogs.count, 1)
        XCTAssertEqual(viewModel.dogs[0].id, "2")
        XCTAssertTrue(mockAPIClient.deleteDogCalled)
    }
}

// MARK: - Mock API Client
class MockAPIClient: APIClient {
    var dogsToReturn: [Dog] = []
    var dogToReturn: Dog?
    var shouldThrowError = false
    var errorToThrow: APIError = .unknown("Test error")
    var createDogCalled = false
    var deleteDogCalled = false

    override func fetchDogs() async throws -> [Dog] {
        if shouldThrowError {
            throw errorToThrow
        }
        return dogsToReturn
    }

    override func createDog(_ dog: Dog) async throws -> Dog {
        createDogCalled = true
        if shouldThrowError {
            throw errorToThrow
        }
        return dogToReturn ?? dog
    }

    override func deleteDog(id: String) async throws {
        deleteDogCalled = true
        if shouldThrowError {
            throw errorToThrow
        }
    }
}
```

**Example: Service Test (Game Logic)**

**File:** `PookieBearTests/Services/MatchDetectionServiceTests.swift`

```swift
import XCTest
@testable import PookieBear

class MatchDetectionServiceTests: XCTestCase {
    var service: MatchDetectionService!

    override func setUp() {
        super.setUp()
        service = MatchDetectionService()
    }

    func testDetectHorizontalMatch() {
        // Given - 3 in a row horizontally
        let grid: [[GridCell]] = [
            [GridCell(id: UUID(), row: 0, col: 0, tileType: .bone),
             GridCell(id: UUID(), row: 0, col: 1, tileType: .bone),
             GridCell(id: UUID(), row: 0, col: 2, tileType: .bone),
             GridCell(id: UUID(), row: 0, col: 3, tileType: .ball)]
        ]

        // When
        let matches = service.detectMatches(in: grid)

        // Then
        XCTAssertEqual(matches.count, 1)
        XCTAssertEqual(matches[0].cells.count, 3)
        XCTAssertEqual(matches[0].matchType, .horizontal)
    }

    func testDetectVerticalMatch() {
        // Given - 3 in a column vertically
        let grid: [[GridCell]] = [
            [GridCell(id: UUID(), row: 0, col: 0, tileType: .paw)],
            [GridCell(id: UUID(), row: 1, col: 0, tileType: .paw)],
            [GridCell(id: UUID(), row: 2, col: 0, tileType: .paw)],
            [GridCell(id: UUID(), row: 3, col: 0, tileType: .ball)]
        ]

        // When
        let matches = service.detectMatches(in: grid)

        // Then
        XCTAssertEqual(matches.count, 1)
        XCTAssertEqual(matches[0].cells.count, 3)
        XCTAssertEqual(matches[0].matchType, .vertical)
    }

    func testDetectLShapeMatch() {
        // Given - L-shape (3 horizontal + 3 vertical sharing corner)
        let grid = createGridWithLShape()

        // When
        let matches = service.detectMatches(in: grid)

        // Then
        XCTAssertTrue(matches.contains { $0.matchType == .lShape })
    }

    func testDetectFiveInRow() {
        // Given - 5 of same type in a row
        let grid: [[GridCell]] = [
            [GridCell(id: UUID(), row: 0, col: 0, tileType: .dog),
             GridCell(id: UUID(), row: 0, col: 1, tileType: .dog),
             GridCell(id: UUID(), row: 0, col: 2, tileType: .dog),
             GridCell(id: UUID(), row: 0, col: 3, tileType: .dog),
             GridCell(id: UUID(), row: 0, col: 4, tileType: .dog)]
        ]

        // When
        let matches = service.detectMatches(in: grid)

        // Then
        XCTAssertEqual(matches.count, 1)
        XCTAssertEqual(matches[0].cells.count, 5)
        XCTAssertTrue(matches[0].isSuperMatch)
    }

    func testNoMatches() {
        // Given - Checkerboard pattern, no matches
        let grid = createCheckerboardGrid()

        // When
        let matches = service.detectMatches(in: grid)

        // Then
        XCTAssertTrue(matches.isEmpty)
    }
}
```

**Example: API Client Test with Mocking**

**File:** `PookieBearTests/Services/APIClientTests.swift`

```swift
import XCTest
@testable import PookieBear

class APIClientTests: XCTestCase {
    var apiClient: APIClient!
    var mockURLSession: MockURLSession!

    override func setUp() {
        super.setUp()
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        mockURLSession = MockURLSession(configuration: config)
        apiClient = APIClient(session: mockURLSession)
    }

    func testLoginSuccess() async throws {
        // Given
        let mockResponse = LoginResponse(
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            user: User(id: "1", email: "test@example.com", firstName: "Test", lastName: "User")
        )
        MockURLProtocol.mockData = try JSONEncoder().encode(mockResponse)
        MockURLProtocol.mockResponse = HTTPURLResponse(
            url: URL(string: "http://localhost:3000")!,
            statusCode: 200,
            httpVersion: nil,
            headerFields: nil
        )

        // When
        let response = try await apiClient.login(email: "test@example.com", password: "password")

        // Then
        XCTAssertEqual(response.accessToken, "mock-access-token")
        XCTAssertEqual(response.user.email, "test@example.com")
    }

    func testLoginFailure401() async {
        // Given
        MockURLProtocol.mockData = """
        {"error": "Invalid credentials"}
        """.data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(
            url: URL(string: "http://localhost:3000")!,
            statusCode: 401,
            httpVersion: nil,
            headerFields: nil
        )

        // When/Then
        do {
            _ = try await apiClient.login(email: "wrong@example.com", password: "wrongpass")
            XCTFail("Should have thrown error")
        } catch APIError.unauthorized {
            // Success - expected error
        } catch {
            XCTFail("Wrong error type: \\(error)")
        }
    }

    func testAuthHeaderIncluded() async throws {
        // Given
        AuthenticationManager.shared.accessToken = "test-token"
        MockURLProtocol.mockData = "[]".data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(
            url: URL(string: "http://localhost:3000")!,
            statusCode: 200,
            httpVersion: nil,
            headerFields: nil
        )

        // When
        _ = try await apiClient.fetchDogs()

        // Then
        XCTAssertEqual(MockURLProtocol.lastRequest?.value(forHTTPHeaderField: "Authorization"), "Bearer test-token")
    }
}

// MARK: - Mock URL Protocol
class MockURLProtocol: URLProtocol {
    static var mockData: Data?
    static var mockResponse: HTTPURLResponse?
    static var mockError: Error?
    static var lastRequest: URLRequest?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        MockURLProtocol.lastRequest = request

        if let error = MockURLProtocol.mockError {
            client?.urlProtocol(self, didFailWithError: error)
            return
        }

        if let response = MockURLProtocol.mockResponse {
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        }

        if let data = MockURLProtocol.mockData {
            client?.urlProtocol(self, didLoad: data)
        }

        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}
}
```

### UI Tests

**What to Test:**
- ✅ Login flow
- ✅ Registration flow
- ✅ Dog creation flow
- ✅ Activity logging flow
- ✅ Navigation between screens
- ✅ PookiePop game playthrough

**Example: Login Flow UI Test**

**File:** `PookieBearUITests/LoginFlowTests.swift`

```swift
import XCTest

class LoginFlowTests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["UI-Testing"]
        app.launch()
    }

    func testSuccessfulLogin() throws {
        // Given - On welcome screen
        XCTAssertTrue(app.staticTexts["Pookie Bear"].exists)

        // When - Tap login
        app.buttons["Log In"].tap()

        // Then - Should show login form
        XCTAssertTrue(app.textFields["Email"].exists)
        XCTAssertTrue(app.secureTextFields["Password"].exists)

        // When - Enter credentials
        let emailField = app.textFields["Email"]
        emailField.tap()
        emailField.typeText("test@example.com")

        let passwordField = app.secureTextFields["Password"]
        passwordField.tap()
        passwordField.typeText("TestPassword123!")

        app.buttons["Login"].tap()

        // Then - Should navigate to dashboard
        let dashboard = app.staticTexts["Hello,"]
        XCTAssertTrue(dashboard.waitForExistence(timeout: 5))
        XCTAssertTrue(app.buttons["Log Walk"].exists)
    }

    func testLoginValidation() throws {
        // Navigate to login
        app.buttons["Log In"].tap()

        // Try to submit empty form
        app.buttons["Login"].tap()

        // Should show validation errors
        XCTAssertTrue(app.staticTexts["Email is required"].exists)
        XCTAssertTrue(app.staticTexts["Password is required"].exists)
    }

    func testLoginFailure() throws {
        // Navigate to login
        app.buttons["Log In"].tap()

        // Enter wrong credentials
        app.textFields["Email"].tap()
        app.textFields["Email"].typeText("wrong@example.com")

        app.secureTextFields["Password"].tap()
        app.secureTextFields["Password"].typeText("wrongpassword")

        app.buttons["Login"].tap()

        // Should show error message
        let errorAlert = app.alerts["Login Failed"]
        XCTAssertTrue(errorAlert.waitForExistence(timeout: 3))
        XCTAssertTrue(errorAlert.staticTexts["Invalid credentials"].exists)
    }
}
```

### Running iOS Tests

```bash
# Run unit tests
cmd + U (in Xcode)

# Or via command line
xcodebuild test -scheme PookieBear -destination 'platform=iOS Simulator,name=iPhone 15 Pro'

# Run specific test
xcodebuild test -scheme PookieBear -only-testing:PookieBearTests/DogsListViewModelTests/testFetchDogsSuccess

# Run UI tests only
xcodebuild test -scheme PookieBear -only-testing:PookieBearUITests

# Generate coverage report
xcodebuild test -scheme PookieBear -enableCodeCoverage YES
```

---

## 🎯 Testing Checklist

### Backend
- [ ] All authentication endpoints tested
- [ ] All dog CRUD endpoints tested
- [ ] All activity endpoints tested
- [ ] All health record endpoints tested
- [ ] All reminder endpoints tested
- [ ] Community endpoints tested
- [ ] JWT utilities tested
- [ ] Validation functions tested
- [ ] Error handling tested
- [ ] 70%+ code coverage achieved

### iOS
- [ ] AuthenticationManager tested
- [ ] APIClient tested (with mocks)
- [ ] DogsListViewModel tested
- [ ] ActivityViewModel tested
- [ ] GameBoardViewModel tested
- [ ] MatchDetectionService tested
- [ ] ScoreCalculationService tested
- [ ] GridGenerationService tested
- [ ] Login flow UI test
- [ ] Registration flow UI test
- [ ] Dog creation flow UI test
- [ ] Activity logging flow UI test
- [ ] Game playthrough UI test
- [ ] 60%+ code coverage achieved

---

## 📚 Testing Best Practices

### General Principles
1. **AAA Pattern** - Arrange, Act, Assert
2. **One assertion per test** (when possible)
3. **Descriptive test names** - `test_methodName_condition_expectedResult`
4. **Fast tests** - Unit tests should run in milliseconds
5. **Isolated tests** - No dependencies between tests
6. **Deterministic** - Same input = same output, always

### What NOT to Test
- ❌ Third-party libraries (trust they're tested)
- ❌ SwiftUI/UIKit framework code
- ❌ Simple getters/setters
- ❌ Pure UI layout (use snapshot tests if needed)

### Mocking Strategy
- **Mock external dependencies** (network, database, file system)
- **Don't mock what you own** (test real implementations when possible)
- **Use protocols** for dependency injection
- **Keep mocks simple** - just enough to test

### Coverage Targets
- **70-80%** is ideal (not 100%)
- **Focus on business logic** over boilerplate
- **Critical paths** must have 100% coverage
- **UI code** can have lower coverage

---

## 🚀 Continuous Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: pookiebear_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./pookiebear-backend
        run: npm ci

      - name: Run tests
        working-directory: ./pookiebear-backend
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/pookiebear_test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./pookiebear-backend/coverage/lcov.info

  ios-tests:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Select Xcode version
        run: sudo xcode-select -s /Applications/Xcode_15.0.app

      - name: Run tests
        run: |
          xcodebuild test \
            -scheme PookieBear \
            -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
            -enableCodeCoverage YES \
            | xcpretty

      - name: Generate coverage report
        run: |
          xcrun xccov view --report --json \
            ~/Library/Developer/Xcode/DerivedData/*/Logs/Test/*.xcresult > coverage.json
```

---

## ✅ Definition of Done - Testing

A feature is **not complete** until:
- [ ] Unit tests written and passing
- [ ] Integration tests written (if applicable)
- [ ] UI tests for critical flows
- [ ] Code coverage meets targets
- [ ] All tests pass in CI
- [ ] Manual testing completed
- [ ] Edge cases handled
- [ ] Error states tested

---

**Remember:** Tests are not a burden - they're insurance. Write tests that give you confidence to ship fast! 🚀
