import SwiftUI

struct ActivityView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Image(systemName: "figure.walk.circle.fill")
                    .resizable()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.green)

                Text("Activity Tracking")
                    .font(.title)
                    .fontWeight(.bold)

                Text("Coming Soon!")
                    .font(.body)
                    .foregroundColor(.secondary)

                Text("Track walks, playtime, and activities with your dog.")
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Activity")
        }
    }
}