import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthenticationManager

    var body: some View {
        NavigationStack {
            List {
                Section {
                    if let user = authManager.currentUser {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .resizable()
                                .frame(width: 60, height: 60)
                                .foregroundColor(.blue)

                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(user.firstName) \(user.lastName)")
                                    .font(.headline)
                                Text(user.email)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.leading, 8)
                        }
                        .padding(.vertical, 8)
                    }
                }

                Section("Account") {
                    NavigationLink {
                        Text("Edit Profile - Coming Soon")
                    } label: {
                        Label("Edit Profile", systemImage: "pencil")
                    }

                    NavigationLink {
                        Text("Settings - Coming Soon")
                    } label: {
                        Label("Settings", systemImage: "gear")
                    }

                    NavigationLink {
                        Text("Notifications - Coming Soon")
                    } label: {
                        Label("Notifications", systemImage: "bell")
                    }
                }

                Section("Support") {
                    NavigationLink {
                        Text("Help & FAQ - Coming Soon")
                    } label: {
                        Label("Help & FAQ", systemImage: "questionmark.circle")
                    }

                    NavigationLink {
                        Text("Contact Us - Coming Soon")
                    } label: {
                        Label("Contact Us", systemImage: "envelope")
                    }
                }

                Section {
                    Button(role: .destructive) {
                        authManager.logout()
                    } label: {
                        HStack {
                            Spacer()
                            Label("Sign Out", systemImage: "arrow.right.square")
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Profile")
        }
    }
}