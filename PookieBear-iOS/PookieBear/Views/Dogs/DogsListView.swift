import SwiftUI

struct DogsListView: View {
    @StateObject private var viewModel = DogsListViewModel()

    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.dogs) { dog in
                    NavigationLink(destination: DogDetailView(dog: dog)) {
                        DogRow(dog: dog)
                    }
                }
            }
            .navigationTitle("My Dogs")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        // Add dog
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .task {
                await viewModel.loadDogs()
            }
        }
    }
}

struct DogRow: View {
    let dog: Dog

    var body: some View {
        HStack(spacing: 16) {
            // Dog photo placeholder
            Circle()
                .fill(LinearGradient(
                    colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ))
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: "pawprint.fill")
                        .foregroundStyle(.blue)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(dog.name)
                    .font(.headline)

                Text(dog.breed)
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                HStack {
                    Text(dog.age)
                    Text("•")
                    Text("\(Int(dog.weightLbs)) lbs")
                }
                .font(.caption)
                .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding(.vertical, 4)
    }
}

struct DogDetailView: View {
    let dog: Dog

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Dog header
                VStack(spacing: 12) {
                    Circle()
                        .fill(LinearGradient(
                            colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .frame(width: 120, height: 120)
                        .overlay(
                            Image(systemName: "pawprint.fill")
                                .font(.system(size: 50))
                                .foregroundStyle(.blue)
                        )

                    Text(dog.name)
                        .font(.title)
                        .fontWeight(.bold)

                    Text(dog.breed)
                        .font(.title3)
                        .foregroundColor(.secondary)
                }
                .padding()

                // Dog info
                VStack(alignment: .leading, spacing: 16) {
                    InfoRow(label: "Age", value: dog.age)
                    InfoRow(label: "Weight", value: "\(Int(dog.weightLbs)) lbs")
                    InfoRow(label: "Gender", value: dog.gender.rawValue.capitalized)
                    if let energyLevel = dog.energyLevel {
                        InfoRow(label: "Energy Level", value: energyLevel.displayName)
                    }
                }
                .padding()
            }
        }
        .navigationTitle(dog.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct InfoRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
    }
}