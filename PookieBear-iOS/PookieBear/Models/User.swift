import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String?
    let phoneNumber: String?
    let firstName: String
    let lastName: String
    let profilePhotoUrl: String?
    let subscriptionTier: String

    var fullName: String {
        "\(firstName) \(lastName)"
    }
}

struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let user: User
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let firstName: String
    let lastName: String
    let phoneNumber: String?
}