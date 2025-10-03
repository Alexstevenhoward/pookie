import Foundation

class APIClient {
    static let shared = APIClient()

    private let baseURL = "http://localhost:3000/api/v1"
    private let session = URLSession.shared

    private init() {}

    // MARK: - Generic Request Method
    private func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil,
        requiresAuth: Bool = true
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add authentication token if required
        if requiresAuth, let token = AuthenticationManager.shared.accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        // Add body if present
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        return try decoder.decode(T.self, from: data)
    }

    // MARK: - Authentication
    func login(email: String, password: String) async throws -> AuthResponse {
        let request = LoginRequest(email: email, password: password)
        return try await self.request(
            endpoint: "/auth/login",
            method: "POST",
            body: request,
            requiresAuth: false
        )
    }

    func register(email: String, password: String, firstName: String, lastName: String) async throws -> AuthResponse {
        let request = RegisterRequest(
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: nil
        )
        return try await self.request(
            endpoint: "/auth/register",
            method: "POST",
            body: request,
            requiresAuth: false
        )
    }

    // MARK: - Dogs
    func fetchDogs() async throws -> [Dog] {
        let response: DogListResponse = try await request(endpoint: "/dogs")
        return response.dogs
    }

    func fetchDog(id: String) async throws -> Dog {
        let response: DogResponse = try await request(endpoint: "/dogs/\(id)")
        return response.dog
    }

    func createDog(_ dog: Dog) async throws -> Dog {
        let response: DogResponse = try await request(
            endpoint: "/dogs",
            method: "POST",
            body: dog
        )
        return response.dog
    }

    func updateDog(_ dog: Dog) async throws -> Dog {
        let response: DogResponse = try await request(
            endpoint: "/dogs/\(dog.id)",
            method: "PATCH",
            body: dog
        )
        return response.dog
    }

    func deleteDog(id: String) async throws {
        struct EmptyResponse: Codable {}
        let _: EmptyResponse = try await request(
            endpoint: "/dogs/\(id)",
            method: "DELETE"
        )
    }

    // MARK: - Activities
    func fetchActivities(dogId: String) async throws -> [Activity] {
        let response: ActivityListResponse = try await request(
            endpoint: "/activities/\(dogId)"
        )
        return response.activities
    }

    func createActivity(_ activity: Activity) async throws -> Activity {
        struct ActivityResponse: Codable {
            let activity: Activity
        }
        let response: ActivityResponse = try await request(
            endpoint: "/activities/\(activity.dogId)",
            method: "POST",
            body: activity
        )
        return response.activity
    }

    func fetchActivityStats(dogId: String, period: String = "week") async throws -> ActivityStats {
        return try await request(
            endpoint: "/activities/\(dogId)/stats?period=\(period)"
        )
    }
}

// MARK: - Errors
enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(statusCode: Int)
    case decodingError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid server response"
        case .httpError(let statusCode):
            return "Server error: \(statusCode)"
        case .decodingError(let error):
            return "Decoding error: \(error.localizedDescription)"
        }
    }
}