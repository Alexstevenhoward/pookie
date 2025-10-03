import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @StateObject private var viewModel = DashboardViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Header with user greeting
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Hello, \(authManager.currentUser?.firstName ?? "there")! 👋")
                            .font(.title)
                            .fontWeight(.bold)

                        Text("How's your pup doing today?")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .padding(.top)

                    // My Dogs Section
                    if viewModel.dogs.isEmpty {
                        // Empty state - add first dog
                        AddFirstDogCard()
                            .padding(.horizontal)
                    } else {
                        // Dog cards carousel
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(viewModel.dogs) { dog in
                                    DogCard(dog: dog)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    // Quick Actions
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Quick Actions")
                            .font(.headline)
                            .padding(.horizontal)

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            QuickActionButton(
                                icon: "figure.walk",
                                title: "Log Walk",
                                color: .blue
                            )

                            QuickActionButton(
                                icon: "cross.case.fill",
                                title: "Health Record",
                                color: .red
                            )

                            QuickActionButton(
                                icon: "fork.knife",
                                title: "Log Feeding",
                                color: .orange
                            )

                            QuickActionButton(
                                icon: "scissors",
                                title: "Grooming",
                                color: .purple
                            )
                        }
                        .padding(.horizontal)
                    }

                    // Today's Activity Summary
                    if let todayStats = viewModel.todayStats {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Today's Activity")
                                .font(.headline)
                                .padding(.horizontal)

                            ActivitySummaryCard(stats: todayStats)
                                .padding(.horizontal)
                        }
                    }

                    // Upcoming Reminders
                    if !viewModel.upcomingReminders.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Upcoming")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(viewModel.upcomingReminders) { reminder in
                                ReminderCard(reminder: reminder)
                            }
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.bottom)
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.inline)
            .refreshable {
                await viewModel.loadData()
            }
        }
        .task {
            await viewModel.loadData()
        }
    }
}

// MARK: - Dog Card
struct DogCard: View {
    let dog: Dog

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Dog photo or placeholder
            ZStack {
                Circle()
                    .fill(LinearGradient(
                        colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))

                Image(systemName: "pawprint.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .foregroundStyle(.blue)
            }
            .frame(width: 80, height: 80)

            VStack(alignment: .leading, spacing: 4) {
                Text(dog.name)
                    .font(.headline)

                Text(dog.breed)
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Text(dog.age)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .frame(width: 180)
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

// MARK: - Add First Dog Card
struct AddFirstDogCard: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "pawprint.circle.fill")
                .resizable()
                .frame(width: 80, height: 80)
                .foregroundStyle(.blue.opacity(0.5))

            Text("Add Your First Dog")
                .font(.title3)
                .fontWeight(.semibold)

            Text("Start tracking your dog's health and activities")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)

            Button {
                // Navigate to add dog
            } label: {
                Text("Add Dog")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .background(Color.blue)
                    .cornerRadius(12)
            }
        }
        .padding(32)
        .frame(maxWidth: .infinity)
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

// MARK: - Quick Action Button
struct QuickActionButton: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        Button {
            // Handle action
        } label: {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 32))
                    .foregroundColor(color)

                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Color(.systemGray6))
            .cornerRadius(16)
        }
    }
}

// MARK: - Activity Summary Card
struct ActivitySummaryCard: View {
    let stats: ActivityStats.Stats

    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 20) {
                StatItem(
                    icon: "figure.walk",
                    value: "\(stats.walkCount)",
                    label: "Walks"
                )

                Divider()
                    .frame(height: 40)

                StatItem(
                    icon: "map",
                    value: String(format: "%.1f", stats.totalDistanceMiles),
                    label: "Miles"
                )

                Divider()
                    .frame(height: 40)

                StatItem(
                    icon: "flame.fill",
                    value: "\(stats.totalCalories)",
                    label: "Calories"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

struct StatItem: View {
    let icon: String
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.blue)

            Text(value)
                .font(.title3)
                .fontWeight(.bold)

            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Reminder Card
struct ReminderCard: View {
    let reminder: Reminder

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: reminder.icon)
                .font(.title2)
                .foregroundColor(reminder.color)
                .frame(width: 50, height: 50)
                .background(reminder.color.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(reminder.title)
                    .font(.subheadline)
                    .fontWeight(.medium)

                Text(reminder.subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Text(reminder.timeText)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Reminder Model
struct Reminder: Identifiable {
    let id = UUID()
    let icon: String
    let title: String
    let subtitle: String
    let timeText: String
    let color: Color
}