import Foundation
import CoreLocation

struct Activity: Codable, Identifiable {
    let id: String
    let dogId: String
    let activityType: ActivityType
    let startTime: Date
    let endTime: Date?
    let durationSeconds: Int?
    let distanceMeters: Double?
    let averagePace: Double?
    let routePolyline: String?
    let routeCoordinates: [Coordinate]?
    let caloriesBurned: Int?
    let steps: Int?
    let temperatureFahrenheit: Double?
    let weatherConditions: [String: String]?
    let notes: String?
    let photos: [String]?
    let intensity: ActivityIntensity?
    let location: String?
    let createdAt: Date

    enum ActivityType: String, Codable {
        case walk, playtime, training, swimming, fetch, park_visit, daycare, hiking

        var displayName: String {
            switch self {
            case .walk: return "Walk"
            case .playtime: return "Playtime"
            case .training: return "Training"
            case .swimming: return "Swimming"
            case .fetch: return "Fetch"
            case .park_visit: return "Park Visit"
            case .daycare: return "Daycare"
            case .hiking: return "Hiking"
            }
        }

        var icon: String {
            switch self {
            case .walk: return "figure.walk"
            case .playtime: return "tennis.racket"
            case .training: return "brain.head.profile"
            case .swimming: return "figure.pool.swim"
            case .fetch: return "tennisball"
            case .park_visit: return "tree"
            case .daycare: return "building.2"
            case .hiking: return "mountain.2"
            }
        }
    }

    enum ActivityIntensity: String, Codable {
        case low, moderate, high
    }

    struct Coordinate: Codable {
        let latitude: Double
        let longitude: Double

        var clLocation: CLLocationCoordinate2D {
            CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        }
    }

    var distanceMiles: Double? {
        guard let meters = distanceMeters else { return nil }
        return meters / 1609.34
    }

    var durationMinutes: Int? {
        guard let seconds = durationSeconds else { return nil }
        return seconds / 60
    }

    var durationFormatted: String {
        guard let seconds = durationSeconds else { return "N/A" }
        let hours = seconds / 3600
        let minutes = (seconds % 3600) / 60
        if hours > 0 {
            return "\(hours)h \(minutes)m"
        }
        return "\(minutes) min"
    }
}

struct ActivityListResponse: Codable {
    let activities: [Activity]
}

struct ActivityStats: Codable {
    let period: String
    let stats: Stats

    struct Stats: Codable {
        let totalActivities: Int
        let totalDistanceMeters: Double
        let totalDistanceMiles: Double
        let totalDurationMinutes: Int
        let totalCalories: Int
        let walkCount: Int
        let averageWalkDistanceMeters: Double
        let averageWalkDistanceMiles: Double
    }
}