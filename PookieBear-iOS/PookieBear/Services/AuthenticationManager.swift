import Foundation
import SwiftUI

class AuthenticationManager: ObservableObject {
    static let shared = AuthenticationManager()

    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var accessToken: String?
    @Published var refreshToken: String?

    private let userDefaultsKeys = (
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        userId: "userId"
    )

    private init() {
        loadTokens()
    }

    func login(email: String, password: String) async throws {
        let response = try await APIClient.shared.login(email: email, password: password)
        await MainActor.run {
            self.saveAuthResponse(response)
        }
    }

    func register(email: String, password: String, firstName: String, lastName: String) async throws {
        let response = try await APIClient.shared.register(
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        )
        await MainActor.run {
            self.saveAuthResponse(response)
        }
    }

    func logout() {
        accessToken = nil
        refreshToken = nil
        currentUser = nil
        isAuthenticated = false

        UserDefaults.standard.removeObject(forKey: userDefaultsKeys.accessToken)
        UserDefaults.standard.removeObject(forKey: userDefaultsKeys.refreshToken)
        UserDefaults.standard.removeObject(forKey: userDefaultsKeys.userId)
    }

    private func saveAuthResponse(_ response: AuthResponse) {
        self.accessToken = response.accessToken
        self.refreshToken = response.refreshToken
        self.currentUser = response.user
        self.isAuthenticated = true

        // Save to UserDefaults
        UserDefaults.standard.set(response.accessToken, forKey: userDefaultsKeys.accessToken)
        UserDefaults.standard.set(response.refreshToken, forKey: userDefaultsKeys.refreshToken)
        UserDefaults.standard.set(response.user.id, forKey: userDefaultsKeys.userId)
    }

    private func loadTokens() {
        accessToken = UserDefaults.standard.string(forKey: userDefaultsKeys.accessToken)
        refreshToken = UserDefaults.standard.string(forKey: userDefaultsKeys.refreshToken)

        if accessToken != nil {
            isAuthenticated = true
        }
    }
}