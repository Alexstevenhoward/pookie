import Foundation

struct Dog: Codable, Identifiable {
    let id: String
    var name: String
    var breed: String
    var dateOfBirth: Date
    var gender: Gender
    var weightLbs: Double
    var neuteredSpayed: Bool
    var microchipId: String?
    var profilePhotoUrl: String?
    var additionalPhotos: [String]?
    var coatColor: String?
    var coatType: CoatType?
    var energyLevel: EnergyLevel?
    var temperamentTags: [String]?
    var specialNeeds: String?

    enum Gender: String, Codable {
        case male, female
    }

    enum CoatType: String, Codable {
        case short, medium, long, curly, wire
    }

    enum EnergyLevel: String, Codable {
        case low, moderate, high, very_high

        var displayName: String {
            switch self {
            case .low: return "Low"
            case .moderate: return "Moderate"
            case .high: return "High"
            case .very_high: return "Very High"
            }
        }
    }

    var age: String {
        let calendar = Calendar.current
        let ageComponents = calendar.dateComponents([.year, .month], from: dateOfBirth, to: Date())

        if let years = ageComponents.year, years > 0 {
            let monthsStr = ageComponents.month ?? 0 > 0 ? " \(ageComponents.month!) mo" : ""
            return "\(years) yr\(monthsStr)"
        } else if let months = ageComponents.month {
            return "\(months) months"
        }
        return "Unknown"
    }
}

struct DogListResponse: Codable {
    let dogs: [Dog]
}

struct DogResponse: Codable {
    let dog: Dog
}