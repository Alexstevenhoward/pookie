import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
                .tag(0)

            DogsListView()
                .tabItem {
                    Label("My Dogs", systemImage: "pawprint.fill")
                }
                .tag(1)

            ActivityView()
                .tabItem {
                    Label("Activity", systemImage: "figure.walk")
                }
                .tag(2)

            HealthView()
                .tabItem {
                    Label("Health", systemImage: "heart.fill")
                }
                .tag(3)

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
                .tag(4)
        }
        .accentColor(.blue)
    }
}