import Foundation

@MainActor
class DogsListViewModel: ObservableObject {
    @Published var dogs: [Dog] = []
    @Published var isLoading = false

    func loadDogs() async {
        isLoading = true

        do {
            dogs = try await APIClient.shared.fetchDogs()
        } catch {
            print("Error loading dogs: \(error)")
        }

        isLoading = false
    }
}