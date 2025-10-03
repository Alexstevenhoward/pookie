import SwiftUI

struct HealthView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Image(systemName: "heart.circle.fill")
                    .resizable()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.red)

                Text("Health Tracking")
                    .font(.title)
                    .fontWeight(.bold)

                Text("Coming Soon!")
                    .font(.body)
                    .foregroundColor(.secondary)

                Text("Track your dog's health records, vet visits, medications, and more.")
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Health")
        }
    }
}