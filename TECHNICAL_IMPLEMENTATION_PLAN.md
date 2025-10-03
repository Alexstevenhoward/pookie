# Pookie Bear App - Complete Technical Implementation Plan

## Overview
This document provides a detailed, step-by-step technical plan to complete all remaining features of the Pookie Bear iOS app.

---

## PHASE 1: Complete Core Features (Week 1)

### 1.1 Complete Dog Management ✅ IN PROGRESS

**Files to Create/Modify**:
- ✅ `EditDogView.swift` - Edit dog form (CREATED)
- ✅ `EnhancedDogDetailView.swift` - Enhanced detail view (CREATED)
- Update `DogsListView.swift` to use EnhancedDogDetailView
- Update `APIClient.swift` - Add updateDog and deleteDog methods (already exist)

**Implementation Steps**:
1. ✅ Create EditDogView with all dog fields pre-populated
2. ✅ Add delete confirmation dialog
3. ✅ Add Edit button to dog detail view
4. Wire up edit/delete to backend API calls
5. Refresh dog list after edit/delete

**API Calls Needed**:
```swift
func updateDog(_ dog: Dog) async throws -> Dog
func deleteDog(id: String) async throws
```

---

### 1.2 Complete Activity Tracking

**Files to Modify**:
- `ActivityListView.swift` - Add edit/delete options
- Create `EditActivityView.swift` - Edit activity form
- `ActivityViewModel.swift` - Add edit/delete methods

**Implementation Steps**:
1. Add swipe-to-delete on activity rows
2. Add tap gesture to open edit view
3. Create EditActivityView (similar to LogActivityView)
4. Add delete confirmation
5. Wire up to backend PUT/DELETE endpoints

**API Calls**:
```swift
// Already exist in APIClient
func updateActivity(_ activity: Activity) async throws -> Activity
func deleteActivity(dogId: String, activityId: String) async throws
```

**UI Changes**:
- Add edit icon in activity row
- Swipe left → Delete option
- Tap row → Edit sheet

---

### 1.3 Complete Profile - Add Edit Functionality

**Files to Create/Modify**:
- Create `EditProfileView.swift`
- Modify `ProfileView.swift` - Add Edit button
- Modify `AuthenticationManager.swift` - Add updateUser method

**Implementation Steps**:
1. Create edit profile form
   - First name
   - Last name
   - Email (read-only or with verification)
   - Phone number
2. Add change password view
3. Wire up to backend PATCH /users/me

**API Calls**:
```swift
func updateUser(_ updates: UserUpdate) async throws -> User

struct UserUpdate: Codable {
    var firstName: String?
    var lastName: String?
    var phoneNumber: String?
}
```

---

### 1.4 Enhanced Dashboard - Complete Quick Actions

**Files to Modify**:
- `DashboardView.swift` - Wire up feeding and grooming buttons
- Create placeholder views for feeding/grooming (will be completed in Phase 2)

**Implementation Steps**:
1. Create `FeedingLogView.swift` (simple form for now)
2. Create `GroomingLogView.swift` (simple form for now)
3. Wire up quick action buttons
4. Add sheets to display these views

---

## PHASE 2: Build New Core Features (Week 2)

### 2.1 Health Records System

**Data Model** - ✅ CREATED
- `HealthRecord.swift` with all fields

**Files to Create**:
1. `HealthRecordsListView.swift` - Main health records view
2. `AddHealthRecordView.swift` - Add/edit form
3. `HealthRecordDetailView.swift` - View single record
4. `HealthRecordsViewModel.swift` - Data management

**Implementation Steps**:

**Step 1: Create HealthRecordsListView**
```swift
struct HealthRecordsListView: View {
    @StateObject var viewModel = HealthRecordsViewModel()
    @State var selectedDog: Dog?
    @State var showAddRecord = false

    var body: some View {
        NavigationStack {
            if viewModel.records.isEmpty {
                // Empty state
            } else {
                List {
                    ForEach(grouped records by type) {
                        // Record rows
                    }
                }
            }
            .toolbar {
                // + button
            }
        }
    }
}
```

**Step 2: Create AddHealthRecordView**
```swift
struct AddHealthRecordView: View {
    // Form fields:
    - Dog selection (Picker)
    - Record type (Picker)
    - Date (DatePicker)
    - Title (TextField) - e.g., "Rabies Vaccine"
    - Description (TextEditor)
    - Veterinarian name (TextField)
    - Clinic name (TextField)
    - Cost (TextField with $ formatting)
    - Next due date (DatePicker, optional)
    - Notes (TextEditor)
}
```

**Step 3: Create HealthRecordsViewModel**
```swift
@MainActor
class HealthRecordsViewModel: ObservableObject {
    @Published var records: [HealthRecord] = []
    @Published var dogs: [Dog] = []
    @Published var isLoading = false
    @Published var groupedRecords: [HealthRecordType: [HealthRecord]] = [:]

    func loadRecords(for dog: Dog) async
    func addRecord(_ record: HealthRecord) async throws
    func updateRecord(_ record: HealthRecord) async throws
    func deleteRecord(_ record: HealthRecord) async throws
}
```

**Step 4: Add to APIClient**
```swift
// Health Records
func fetchHealthRecords(dogId: String) async throws -> [HealthRecord]
func createHealthRecord(dogId: String, record: HealthRecord) async throws -> HealthRecord
func updateHealthRecord(dogId: String, recordId: String, record: HealthRecord) async throws -> HealthRecord
func deleteHealthRecord(dogId: String, recordId: String) async throws
```

**Step 5: Update MainTabView**
```swift
// Replace HealthView() with:
HealthRecordsListView()
    .tabItem {
        Label("Health", systemImage: "heart.fill")
    }
```

**UI Features**:
- Group records by type (Vaccinations, Vet Visits, etc.)
- Color-code by record type
- Show next due date prominently if exists
- Filter by dog
- Search functionality
- Export to PDF (future)

---

### 2.2 Feeding Log System

**Data Model to Create**:
```swift
struct FeedingRecord: Codable, Identifiable, Hashable {
    let id: String
    let dogId: String
    var feedingTime: Date
    var foodType: FoodType
    var foodBrand: String?
    var portionSize: Double // in cups or grams
    var portionUnit: PortionUnit
    var calories: Int?
    var notes: String?
    let createdAt: Date

    enum FoodType: String, Codable {
        case dryKibble = "dry_kibble"
        case wetFood = "wet_food"
        case raw
        case homemade
        case treats
        case other
    }

    enum PortionUnit: String, Codable {
        case cups
        case grams
        case ounces
    }
}
```

**Files to Create**:
1. `FeedingRecord.swift` - Data model
2. `FeedingLogListView.swift` - View feeding history
3. `AddFeedingView.swift` - Log feeding form
4. `FeedingViewModel.swift` - Data management
5. `FeedingScheduleView.swift` - Set feeding schedule/reminders

**Backend Requirements**:
- Need to add feeding endpoints to backend API
- Database table: feeding_logs
- Endpoints:
  - GET /api/v1/feeding/:dogId
  - POST /api/v1/feeding/:dogId
  - GET /api/v1/feeding/:dogId/:feedingId
  - PATCH /api/v1/feeding/:dogId/:feedingId
  - DELETE /api/v1/feeding/:dogId/:feedingId

**Implementation Steps**:

**Step 1: Backend API** (Outside iOS scope, but needed)
```typescript
// Add to backend:
- Create feeding_logs table
- Add feeding routes
- Add feeding controller
- Add feeding service
```

**Step 2: iOS Data Model**
- Create `FeedingRecord.swift`
- Add to Models/ folder

**Step 3: Create Views**
```swift
// FeedingLogListView
- List of feedings grouped by date
- Show time, food type, portion
- Daily summary (total feedings, total calories)
- Filter by dog
- Calendar view option

// AddFeedingView
- Quick log button (logs current time with defaults)
- Detailed form:
  * Dog selection
  * Time (defaults to now)
  * Food type
  * Brand/name
  * Portion size with unit
  * Calories (optional)
  * Notes
```

**Step 4: Add to Dashboard**
- "Log Feeding" quick action → AddFeedingView
- Show "Last fed: 2 hours ago" on dog cards
- Feeding reminder notifications (Phase 3)

---

### 2.3 Grooming System

**Data Model**:
```swift
struct GroomingRecord: Codable, Identifiable, Hashable {
    let id: String
    let dogId: String
    var groomingDate: Date
    var groomingType: GroomingType
    var groomerName: String?
    var salonName: String?
    var cost: Double?
    var services: [String]? // ["bath", "haircut", "nail trim"]
    var nextAppointment: Date?
    var notes: String?
    var photos: [String]? // Before/after photos
    let createdAt: Date

    enum GroomingType: String, Codable {
        case fullGrooming = "full_grooming"
        case bath
        case haircut
        case nailTrim = "nail_trim"
        case teethCleaning = "teeth_cleaning"
        case earCleaning = "ear_cleaning"
        case other
    }
}
```

**Files to Create**:
1. `GroomingRecord.swift`
2. `GroomingListView.swift`
3. `AddGroomingView.swift`
4. `GroomingViewModel.swift`

**Backend Requirements**:
- Add grooming endpoints (similar to feeding)
- Database table: grooming_logs

**UI Features**:
- List of grooming appointments/history
- Before/after photo capability
- Set recurring appointments
- Reminder notifications
- Track cost over time
- Filter by service type

---

## PHASE 3: Enhanced Features (Week 3)

### 3.1 Photo Upload System

**Architecture**:
```
iOS App → Upload Image → S3/Cloud Storage
                       ↓
                  Get URL ← Backend API
                       ↓
                  Save URL in database
```

**Implementation Steps**:

**Step 1: Backend Setup**
- Set up image storage (AWS S3, Cloudinary, or similar)
- Add upload endpoint: POST /api/v1/upload
- Add image URL fields to models (dogs, activities, health records)

**Step 2: iOS Implementation**

Create `ImagePicker.swift`:
```swift
struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.dismiss) var dismiss

    // Implement PHPickerViewController
    // Handle image selection
    // Compress image
    // Return UIImage
}
```

Create `ImageUploadManager.swift`:
```swift
class ImageUploadManager {
    static let shared = ImageUploadManager()

    func uploadImage(_ image: UIImage) async throws -> String {
        // 1. Compress image to reasonable size (max 1MB)
        // 2. Convert to JPEG data
        // 3. Create multipart form data
        // 4. POST to /api/v1/upload
        // 5. Return image URL
    }
}
```

**Step 3: Integrate into Views**
- Add photo picker to AddDogView
- Add photo picker to EditDogView
- Add photo picker to LogActivityView
- Add photo picker to AddHealthRecordView
- Display photos in detail views

**UI Changes**:
- Dog card: Show actual photo instead of placeholder
- Activity row: Thumbnail if photo exists
- Photo gallery view for multiple photos
- Tap to view full screen

---

### 3.2 Reminders & Notifications

**Data Model**:
```swift
struct Reminder: Codable, Identifiable {
    let id: String
    let dogId: String
    var reminderType: ReminderType
    var title: String
    var scheduledDate: Date
    var isRecurring: Bool
    var recurrenceInterval: RecurrenceInterval?
    var isCompleted: Bool
    var completedDate: Date?
    var notes: String?

    enum ReminderType: String, Codable {
        case vaccination
        case vetAppointment
        case medication
        case grooming
        case feeding
        case other
    }

    enum RecurrenceInterval: String, Codable {
        case daily, weekly, monthly, yearly
    }
}
```

**Implementation Steps**:

**Step 1: Local Notifications**
```swift
import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()

    func requestAuthorization() async throws -> Bool

    func scheduleReminder(_ reminder: Reminder) async throws

    func cancelReminder(id: String)

    func scheduleRecurringReminder(_ reminder: Reminder) async throws
}
```

**Step 2: Reminder UI**
- Create `RemindersListView.swift`
- Create `AddReminderView.swift`
- Add reminder icon to health records (set reminder for next vaccination)
- Add reminder icon to grooming (set next appointment reminder)
- Show upcoming reminders on dashboard (replace mock data)

**Step 3: Backend**
- Store reminders in database
- Sync between devices (future)

---

### 3.3 Analytics & Charts

**Libraries Needed**:
```swift
import Charts // iOS 16+ native charts
```

**Views to Create**:
1. `ActivityChartsView.swift` - Activity trends
2. `WeightChartView.swift` - Weight tracking over time
3. `HealthDashboardView.swift` - Health metrics

**Charts to Implement**:

**Activity Charts**:
- Line chart: Activities per week
- Bar chart: Activity duration by type
- Pie chart: Activity type distribution
- Line chart: Distance walked over time

**Weight Chart**:
- Line chart with weight over time
- Goal weight indicator
- Weight trend (gaining/losing/stable)

**Health Dashboard**:
- Vaccination timeline
- Medication schedule
- Vet visit history

**Implementation**:
```swift
struct ActivityChartsView: View {
    @StateObject var viewModel: ActivityChartsViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Activities This Week
                Chart {
                    ForEach(weeklyData) { day in
                        BarMark(
                            x: .value("Day", day.date),
                            y: .value("Count", day.activityCount)
                        )
                    }
                }
                .frame(height: 200)

                // Distance Walked
                Chart {
                    ForEach(distanceData) { point in
                        LineMark(
                            x: .value("Date", point.date),
                            y: .value("Miles", point.miles)
                        )
                    }
                }
                .frame(height: 200)
            }
        }
    }
}
```

---

## PHASE 4: Advanced Features (Week 4)

### 4.1 Offline Mode

**Architecture**:
- Use Core Data or SwiftData for local storage
- Sync when network available
- Queue failed API calls for retry

**Implementation**:

**Step 1: Add Core Data Stack**
```swift
import CoreData

class PersistenceController {
    static let shared = PersistenceController()
    let container: NSPersistentContainer

    init() {
        container = NSPersistentContainer(name: "PookieBear")
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Core Data failed: \(error)")
            }
        }
    }
}
```

**Step 2: Create Core Data Models**
- DogEntity
- ActivityEntity
- HealthRecordEntity
- FeedingRecordEntity
- GroomingRecordEntity

**Step 3: Sync Manager**
```swift
class SyncManager {
    static let shared = SyncManager()

    func syncAll() async throws {
        // Sync dogs
        // Sync activities
        // Sync health records
        // etc.
    }

    func queueOperation(_ operation: SyncOperation)
    func processQueue() async
}
```

**Step 4: Network Monitoring**
```swift
import Network

class NetworkMonitor: ObservableObject {
    @Published var isConnected = true
    private let monitor = NWPathMonitor()

    func startMonitoring() {
        monitor.pathUpdateHandler = { path in
            DispatchQueue.main.async {
                self.isConnected = path.status == .satisfied
            }
        }
    }
}
```

---

### 4.2 Widget Support

**Implementation**:

**Step 1: Create Widget Extension**
- File → New → Target → Widget Extension
- Name: PookieBearWidget

**Step 2: Widget Views**
```swift
struct DogStatsWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: "DogStatsWidget",
            provider: DogStatsProvider()
        ) { entry in
            DogStatsWidgetView(entry: entry)
        }
    }
}

struct DogStatsWidgetView: View {
    var body: some View {
        VStack {
            // Show dog name
            // Last activity time
            // Next reminder
        }
    }
}
```

**Widget Types**:
- Small: Single dog with last activity
- Medium: Activity stats for today
- Large: Multiple dogs with stats

---

### 4.3 Dark Mode Support

**Implementation**:

**Step 1: Update Color System**
```swift
extension Color {
    static let appBackground = Color("AppBackground")
    static let cardBackground = Color("CardBackground")
    static let primaryText = Color("PrimaryText")
    static let secondaryText = Color("SecondaryText")
}
```

**Step 2: Add to Assets**
- Create color sets in Assets.xcassets
- Define for both light and dark appearance

**Step 3: Test all views**
- Ensure all views work in dark mode
- Update hardcoded colors to use semantic colors

**Current Colors to Update**:
- `Color(red: 0.95, green: 0.95, blue: 0.97)` → `Color.cardBackground`
- `.black` for text → `Color.primaryText`
- `.secondary` is already adaptive

---

### 4.4 Export & Share Features

**Export Data**:
```swift
class DataExporter {
    func exportToPDF() -> Data {
        // Generate PDF with dog info
        // Include health records
        // Include activity summary
    }

    func exportToCSV() -> Data {
        // Export activities to CSV
        // Export health records to CSV
    }

    func exportToJSON() -> Data {
        // Export all data as JSON backup
    }
}
```

**Share Activity**:
```swift
struct ShareActivityView: View {
    let activity: Activity

    var body: some View {
        ShareLink(
            item: generateShareText(),
            preview: SharePreview(
                "Walk with \(dogName)",
                image: Image(systemName: "dog.fill")
            )
        )
    }
}
```

---

## PHASE 5: Polish & Optimization (Week 5)

### 5.1 Performance Optimization

**Image Caching**:
```swift
class ImageCache {
    static let shared = ImageCache()
    private let cache = NSCache<NSString, UIImage>()

    func get(_ key: String) -> UIImage?
    func set(_ image: UIImage, for key: String)
}
```

**List Optimization**:
- Use LazyVStack where appropriate
- Implement pagination for long lists
- Cache network responses

**Database Optimization**:
- Add indexes to Core Data entities
- Batch fetch requests
- Use NSFetchedResultsController for lists

---

### 5.2 Error Handling & Logging

**Centralized Error Handler**:
```swift
class ErrorHandler {
    static func handle(_ error: Error, context: String) {
        // Log to console
        print("❌ Error in \(context): \(error)")

        // Log to analytics (Crashlytics, etc.)
        // Analytics.logError(error, context: context)

        // Show user-friendly message
        NotificationCenter.default.post(
            name: .showError,
            object: error.localizedDescription
        )
    }
}
```

**Logging System**:
```swift
enum LogLevel {
    case debug, info, warning, error
}

class Logger {
    static func log(_ message: String, level: LogLevel) {
        let emoji = level == .error ? "❌" : "ℹ️"
        print("\(emoji) [\(level)] \(message)")
    }
}
```

---

### 5.3 Testing

**Unit Tests**:
```swift
// Test API Client
func testFetchDogs() async throws {
    let dogs = try await APIClient.shared.fetchDogs()
    XCTAssertFalse(dogs.isEmpty)
}

// Test View Models
func testDashboardViewModel() async {
    let vm = DashboardViewModel()
    await vm.loadData()
    XCTAssertFalse(vm.dogs.isEmpty)
}
```

**UI Tests**:
```swift
func testAddDog() throws {
    let app = XCUIApplication()
    app.launch()

    app.buttons["Add Dog"].tap()
    // Fill form
    // Tap save
    // Verify dog appears in list
}
```

---

### 5.4 Accessibility

**VoiceOver Support**:
```swift
// Add accessibility labels
Image(systemName: "dog.fill")
    .accessibilityLabel("Dog profile picture")

Button("Add") {
    // action
}
.accessibilityHint("Adds a new dog to your profile")
```

**Dynamic Type**:
- All text uses system fonts (already done)
- Test with larger text sizes
- Ensure layouts adapt

**Color Contrast**:
- Verify WCAG AA compliance
- Test with color blindness simulators

---

## PHASE 6: App Store Preparation

### 6.1 App Icon & Branding

**Requirements**:
- 1024x1024 App Store icon
- All required sizes for iOS
- Launch screen
- App name finalization

### 6.2 Privacy Policy & Terms

**Documents Needed**:
- Privacy Policy
- Terms of Service
- Data deletion instructions

### 6.3 App Store Listing

**Prepare**:
- Screenshots (6.5", 5.5" displays)
- App description
- Keywords
- What's New text
- Promotional text
- Support URL
- Marketing URL

---

## IMPLEMENTATION PRIORITY

### Must Have (MVP+):
1. ✅ Edit/Delete Dogs
2. Health Records complete system
3. Fix network connectivity issues
4. App icon

### Should Have:
1. Feeding log
2. Grooming log
3. Edit/Delete Activities
4. Photo upload
5. Reminders system

### Nice to Have:
1. Charts & analytics
2. Widget
3. Dark mode
4. Offline mode
5. Export/Share
6. Advanced search/filters

---

## ESTIMATED TIMELINE

**Week 1**: Complete existing features
- Days 1-2: Edit/Delete for dogs and activities
- Days 3-5: Health Records full implementation

**Week 2**: New features
- Days 1-2: Feeding log
- Days 3-4: Grooming log
- Day 5: Photo upload setup

**Week 3**: Enhanced features
- Days 1-2: Reminders & notifications
- Days 3-5: Charts & analytics

**Week 4**: Advanced features
- Days 1-2: Offline mode
- Days 3-4: Widget
- Day 5: Dark mode

**Week 5**: Polish
- Days 1-2: Performance optimization
- Days 3-4: Testing & bug fixes
- Day 5: App Store preparation

---

## SUCCESS METRICS

- [ ] All core features working
- [ ] No critical bugs
- [ ] App runs smoothly on iOS 15+
- [ ] Network connectivity stable
- [ ] Data persists correctly
- [ ] UI is polished and consistent
- [ ] Accessible to all users
- [ ] Ready for TestFlight/App Store

---

This plan provides a complete roadmap to transform Pookie Bear from an MVP to a fully-featured, production-ready iOS app!
