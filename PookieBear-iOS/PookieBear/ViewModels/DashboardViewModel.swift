import Foundation
import SwiftUI

@MainActor
class DashboardViewModel: ObservableObject {
    @Published var dogs: [Dog] = []
    @Published var todayStats: ActivityStats.Stats?
    @Published var upcomingReminders: [Reminder] = []
    @Published var isLoading = false

    func loadData() async {
        isLoading = true

        do {
            // Load dogs
            dogs = try await APIClient.shared.fetchDogs()

            // Load today's activity stats for first dog
            if let firstDog = dogs.first {
                let stats = try await APIClient.shared.fetchActivityStats(
                    dogId: firstDog.id,
                    period: "day"
                )
                todayStats = stats.stats
            }

            // Mock reminders (would come from backend in production)
            upcomingReminders = [
                Reminder(
                    icon: "cross.case.fill",
                    title: "Vet Appointment",
                    subtitle: "Annual checkup",
                    timeText: "Tomorrow",
                    color: .red
                ),
                Reminder(
                    icon: "syringe.fill",
                    title: "Vaccination Due",
                    subtitle: "Rabies booster",
                    timeText: "In 5 days",
                    color: .orange
                )
            ]
        } catch {
            print("Error loading dashboard data: \(error)")
        }

        isLoading = false
    }
}