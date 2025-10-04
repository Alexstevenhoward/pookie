# 📱 Mobile Development Standards
## Professional Cross-Platform Architecture Guide

**Purpose:** Establish consistent, maintainable, scalable mobile app architecture
**Scope:** iOS (current) → Android (future)
**Philosophy:** Write once mentally, implement platform-natively

---

## 🎯 Core Principles

### 1. Platform-Native, Shared Architecture
- **Native UI Frameworks:** SwiftUI (iOS) → Jetpack Compose (Android)
- **Same Architecture Pattern:** MVVM everywhere
- **Shared Backend:** Single REST API serves both platforms
- **Consistent Design System:** Same colors, spacing, components (adapted to platform conventions)

### 2. Separation of Concerns
```
View Layer        → Pure UI, no business logic
ViewModel Layer   → Business logic, state management
Service Layer     → API calls, data persistence, utilities
Model Layer       → Data structures, entities
```

### 3. Testability First
- Every component designed for testing
- Dependency injection throughout
- Mock-friendly interfaces
- High code coverage targets

### 4. Accessibility by Default
- VoiceOver/TalkBack support from day one
- Semantic labels on all interactive elements
- Dynamic type support
- Color contrast compliance (WCAG AA)

### 5. Performance Standards
- 60fps UI rendering minimum
- < 2s cold start time
- < 500ms screen transitions
- Lazy loading for lists
- Image caching and optimization

---

## 🏗️ Architecture: MVVM Pattern

### Overview

```
┌─────────────────────────────────────────┐
│              View Layer                  │  SwiftUI / Jetpack Compose
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ View 1  │  │ View 2  │  │ View 3  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       ▼            ▼            ▼       │
│  ┌───────────────────────────────────┐ │
│  │      @Published / StateFlow       │ │
│  └───────────────────────────────────┘ │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│          ViewModel Layer                 │  Observable Objects
│  ┌──────────────┐  ┌──────────────┐    │
│  │ ViewModel 1  │  │ ViewModel 2  │    │
│  │              │  │              │    │
│  │ • State      │  │ • State      │    │
│  │ • Actions    │  │ • Actions    │    │
│  │ • Computed   │  │ • Computed   │    │
│  └──────┬───────┘  └──────┬───────┘    │
│         │                  │            │
└─────────┼──────────────────┼────────────┘
          │                  │
┌─────────▼──────────────────▼────────────┐
│           Service Layer                  │  Business Logic
│  ┌──────────┐  ┌────────────┐          │
│  │APIClient │  │AuthManager │  etc.    │
│  └──────┬───┘  └─────┬──────┘          │
│         │            │                  │
└─────────┼────────────┼──────────────────┘
          │            │
┌─────────▼────────────▼──────────────────┐
│            Model Layer                   │  Data Structures
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ Dog  │  │ User │  │Activity│         │
│  └──────┘  └──────┘  └──────┘          │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### View Layer
**What it does:**
- Renders UI based on ViewModel state
- Handles user interactions (taps, swipes)
- Triggers ViewModel actions
- Navigation

**What it does NOT do:**
- ❌ Business logic
- ❌ API calls
- ❌ Data transformation
- ❌ Validation logic

**iOS Example:**
```swift
struct DogsListView: View {
    @StateObject private var viewModel = DogsListViewModel()

    var body: some View {
        NavigationStack {
            List(viewModel.dogs) { dog in
                DogRow(dog: dog)
            }
            .navigationTitle("My Dogs")
            .refreshable {
                await viewModel.fetchDogs()
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK") { }
            } message: {
                Text(viewModel.errorMessage ?? "Unknown error")
            }
        }
        .task {
            await viewModel.fetchDogs()
        }
    }
}
```

**Android Equivalent (Future):**
```kotlin
@Composable
fun DogsListScreen(viewModel: DogsListViewModel = hiltViewModel()) {
    val dogs by viewModel.dogs.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = { TopAppBar(title = { Text("My Dogs") }) }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(dogs) { dog ->
                DogRow(dog = dog)
            }
        }

        error?.let {
            AlertDialog(
                onDismissRequest = { viewModel.clearError() },
                title = { Text("Error") },
                text = { Text(it) },
                confirmButton = { Button(onClick = { viewModel.clearError() }) { Text("OK") } }
            )
        }
    }

    LaunchedEffect(Unit) {
        viewModel.fetchDogs()
    }
}
```

#### ViewModel Layer
**What it does:**
- Manages UI state (`@Published` / `StateFlow`)
- Executes business logic
- Calls services (API, database)
- Transforms data for UI
- Handles loading/error states

**What it does NOT do:**
- ❌ Direct API calls (delegates to services)
- ❌ UI rendering
- ❌ Navigation logic
- ❌ Platform-specific code

**iOS Standard:**
```swift
@MainActor
class DogsListViewModel: ObservableObject {
    // MARK: - Published State
    @Published private(set) var dogs: [Dog] = []
    @Published private(set) var isLoading = false
    @Published private(set) var errorMessage: String?
    @Published var showError = false

    // MARK: - Dependencies
    private let apiClient: APIClient
    private let analyticsManager: AnalyticsManager

    // MARK: - Initialization
    init(apiClient: APIClient = .shared, analyticsManager: AnalyticsManager = .shared) {
        self.apiClient = apiClient
        self.analyticsManager = analyticsManager
    }

    // MARK: - Actions
    func fetchDogs() async {
        isLoading = true
        errorMessage = nil

        do {
            dogs = try await apiClient.fetchDogs()
            analyticsManager.track(.dogsLoaded, properties: ["count": dogs.count])
        } catch {
            errorMessage = error.localizedDescription
            showError = true
            analyticsManager.track(.error, properties: ["message": error.localizedDescription])
        }

        isLoading = false
    }

    func createDog(_ dog: Dog) async {
        isLoading = true

        do {
            let createdDog = try await apiClient.createDog(dog)
            dogs.append(createdDog)
            analyticsManager.track(.dogCreated)
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }

        isLoading = false
    }

    func deleteDog(id: String) async {
        do {
            try await apiClient.deleteDog(id: id)
            dogs.removeAll { $0.id == id }
            analyticsManager.track(.dogDeleted)
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }
    }

    // MARK: - Computed Properties
    var hasDogs: Bool {
        !dogs.isEmpty
    }

    var dogCount: Int {
        dogs.count
    }
}
```

**Android Equivalent (Future):**
```kotlin
@HiltViewModel
class DogsListViewModel @Inject constructor(
    private val apiClient: APIClient,
    private val analyticsManager: AnalyticsManager
) : ViewModel() {

    // State
    private val _dogs = MutableStateFlow<List<Dog>>(emptyList())
    val dogs: StateFlow<List<Dog>> = _dogs.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // Actions
    fun fetchDogs() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null

            try {
                _dogs.value = apiClient.fetchDogs()
                analyticsManager.track("dogs_loaded", mapOf("count" to _dogs.value.size))
            } catch (e: Exception) {
                _error.value = e.message
                analyticsManager.track("error", mapOf("message" to e.message))
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun createDog(dog: Dog) {
        viewModelScope.launch {
            _isLoading.value = true

            try {
                val createdDog = apiClient.createDog(dog)
                _dogs.value = _dogs.value + createdDog
                analyticsManager.track("dog_created")
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Computed
    val hasDogs: Boolean get() = _dogs.value.isNotEmpty()
    val dogCount: Int get() = _dogs.value.size
}
```

#### Service Layer
**What it does:**
- Network requests (API calls)
- Data persistence (UserDefaults, Core Data, Room)
- Business utilities (formatters, validators)
- Third-party SDK wrappers

**iOS Standard:**
```swift
class APIClient {
    static let shared = APIClient()

    private let baseURL: String
    private let session: URLSession

    init(baseURL: String = Environment.apiBaseURL, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    func fetchDogs() async throws -> [Dog] {
        let url = URL(string: "\\(baseURL)/dogs")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \\(AuthenticationManager.shared.accessToken ?? "")", forHTTPHeaderField: "Authorization")

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode([Dog].self, from: data)
    }

    // ... more methods
}
```

**Android Equivalent (Future):**
```kotlin
class APIClient @Inject constructor(
    private val retrofit: Retrofit,
    private val authManager: AuthManager
) {
    private val api: PookieAPI = retrofit.create(PookieAPI::class.java)

    suspend fun fetchDogs(): List<Dog> {
        val response = api.getDogs(authManager.accessToken ?: "")

        if (!response.isSuccessful) {
            throw APIError.HttpError(response.code())
        }

        return response.body() ?: emptyList()
    }

    // ... more methods
}
```

#### Model Layer
**What it does:**
- Data structures
- Codable/Serializable conformance
- Computed properties (pure data transformation)

**iOS Standard:**
```swift
struct Dog: Codable, Identifiable {
    let id: String
    var name: String
    var breed: String
    var dateOfBirth: String
    var gender: String
    var weight: Double?
    var profilePhotoUrl: String?
    var additionalPhotos: [String]?
    var coatColor: String?
    var isNeutered: Bool?

    // Computed properties
    var age: Int {
        // Calculate age from dateOfBirth
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let birthDate = formatter.date(from: dateOfBirth) else { return 0 }
        return Calendar.current.dateComponents([.year], from: birthDate, to: Date()).year ?? 0
    }

    var displayWeight: String {
        guard let weight = weight else { return "N/A" }
        return String(format: "%.1f lbs", weight)
    }
}
```

**Android Equivalent (Future):**
```kotlin
@Serializable
data class Dog(
    val id: String,
    var name: String,
    var breed: String,
    var dateOfBirth: String,
    var gender: String,
    var weight: Double? = null,
    var profilePhotoUrl: String? = null,
    var additionalPhotos: List<String>? = null,
    var coatColor: String? = null,
    var isNeutered: Boolean? = null
) {
    // Computed properties
    val age: Int
        get() {
            // Calculate age from dateOfBirth
            val birthDate = LocalDate.parse(dateOfBirth)
            return Period.between(birthDate, LocalDate.now()).years
        }

    val displayWeight: String
        get() = weight?.let { "%.1f lbs".format(it) } ?: "N/A"
}
```

---

## 🎨 Design System Standards

### Color Palette (Cross-Platform)

**Define once, use everywhere:**

**iOS Implementation:**
```swift
struct AppColors {
    // Primary Colors
    static let tealPrimary = Color(red: 0.4, green: 0.8, blue: 0.8)        // #66CCCC
    static let peachAccent = Color(red: 1.0, green: 0.7, blue: 0.6)        // #FFB399
    static let mintSecondary = Color(red: 0.6, green: 0.9, blue: 0.7)      // #99E6B3
    static let aquaHighlight = Color(red: 0.5, green: 0.9, blue: 0.9)      // #80E6E6

    // Neutral Colors
    static let backgroundLight = Color(red: 0.98, green: 0.98, blue: 0.99) // #FAFAFC
    static let cardBackground = Color.white
    static let textPrimary = Color(red: 0.2, green: 0.2, blue: 0.3)        // #33334D
    static let textSecondary = Color(red: 0.5, green: 0.5, blue: 0.6)      // #80809A

    // Semantic Colors
    static let success = Color.green
    static let error = Color.red
    static let warning = Color.orange
    static let info = Color.blue
}
```

**Android Equivalent:**
```xml
<!-- res/values/colors.xml -->
<resources>
    <!-- Primary Colors -->
    <color name="teal_primary">#66CCCC</color>
    <color name="peach_accent">#FFB399</color>
    <color name="mint_secondary">#99E6B3</color>
    <color name="aqua_highlight">#80E6E6</color>

    <!-- Neutral Colors -->
    <color name="background_light">#FAFAFC</color>
    <color name="card_background">#FFFFFF</color>
    <color name="text_primary">#33334D</color>
    <color name="text_secondary">#80809A</color>

    <!-- Semantic Colors -->
    <color name="success">#4CAF50</color>
    <color name="error">#F44336</color>
    <color name="warning">#FF9800</color>
    <color name="info">#2196F3</color>
</resources>
```

### Typography

**iOS:**
```swift
struct AppFonts {
    // Headings
    static let largeTitle = Font.system(size: 34, weight: .bold)
    static let title1 = Font.system(size: 28, weight: .bold)
    static let title2 = Font.system(size: 22, weight: .semibold)
    static let title3 = Font.system(size: 20, weight: .semibold)

    // Body
    static let body = Font.system(size: 17, weight: .regular)
    static let bodyBold = Font.system(size: 17, weight: .semibold)
    static let caption = Font.system(size: 14, weight: .regular)
    static let footnote = Font.system(size: 12, weight: .regular)

    // Custom
    static let cuteBrand = Font.custom("Cute", size: 48)
}
```

**Android:**
```xml
<!-- res/values/typography.xml -->
<resources>
    <style name="TextAppearance.App.LargeTitle" parent="TextAppearance.MaterialComponents.Headline3">
        <item name="android:textSize">34sp</item>
        <item name="android:textStyle">bold</item>
    </style>

    <style name="TextAppearance.App.Title1" parent="TextAppearance.MaterialComponents.Headline4">
        <item name="android:textSize">28sp</item>
        <item name="android:textStyle">bold</item>
    </style>

    <style name="TextAppearance.App.Body" parent="TextAppearance.MaterialComponents.Body1">
        <item name="android:textSize">17sp</item>
    </style>

    <!-- Custom font -->
    <style name="TextAppearance.App.CuteBrand">
        <item name="android:fontFamily">@font/cute</item>
        <item name="android:textSize">48sp</item>
    </style>
</resources>
```

### Spacing System

**Consistent spacing scale:**
- **4pt** - Tiny (icon padding)
- **8pt** - Small (tight spacing)
- **12pt** - Medium (standard padding)
- **16pt** - Large (card padding)
- **20pt** - XLarge (section spacing)
- **24pt** - XXLarge (screen margins)

**iOS:**
```swift
struct Spacing {
    static let tiny: CGFloat = 4
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let xLarge: CGFloat = 20
    static let xxLarge: CGFloat = 24
}
```

**Android:**
```xml
<!-- res/values/dimens.xml -->
<resources>
    <dimen name="spacing_tiny">4dp</dimen>
    <dimen name="spacing_small">8dp</dimen>
    <dimen name="spacing_medium">12dp</dimen>
    <dimen name="spacing_large">16dp</dimen>
    <dimen name="spacing_xlarge">20dp</dimen>
    <dimen name="spacing_xxlarge">24dp</dimen>
</resources>
```

### Component Library

**Reusable components across platform:**

**iOS - Claymorphism Button:**
```swift
struct ClayButton: View {
    let title: String
    let icon: String?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Spacing.small) {
                if let icon = icon {
                    Image(systemName: icon)
                }
                Text(title)
                    .font(AppFonts.bodyBold)
            }
            .padding(.horizontal, Spacing.large)
            .padding(.vertical, Spacing.medium)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(AppColors.cardBackground)
                    .shadow(color: Color.black.opacity(0.1), radius: 8, x: 4, y: 4)
                    .shadow(color: Color.white.opacity(0.7), radius: 8, x: -4, y: -4)
            )
        }
    }
}
```

**Android - Material Button (Claymorphism-inspired):**
```kotlin
@Composable
fun ClayButton(
    title: String,
    icon: ImageVector? = null,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(12.dp)
            ),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White
        ),
        contentPadding = PaddingValues(
            horizontal = 16.dp,
            vertical = 12.dp
        )
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            icon?.let {
                Icon(imageVector = it, contentDescription = null)
            }
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold)
            )
        }
    }
}
```

---

## 🔌 Dependency Injection

### iOS - Manual DI (Current)

```swift
// Protocol-based dependencies
protocol APIClientProtocol {
    func fetchDogs() async throws -> [Dog]
    func createDog(_ dog: Dog) async throws -> Dog
}

class DogsListViewModel: ObservableObject {
    private let apiClient: APIClientProtocol

    init(apiClient: APIClientProtocol = APIClient.shared) {
        self.apiClient = apiClient
    }
}

// Usage in view
struct DogsListView: View {
    @StateObject private var viewModel: DogsListViewModel

    init(apiClient: APIClientProtocol = APIClient.shared) {
        _viewModel = StateObject(wrappedValue: DogsListViewModel(apiClient: apiClient))
    }
}

// Testing with mock
class MockAPIClient: APIClientProtocol {
    var dogsToReturn: [Dog] = []

    func fetchDogs() async throws -> [Dog] {
        return dogsToReturn
    }
}

// In tests
let mockAPI = MockAPIClient()
mockAPI.dogsToReturn = [testDog1, testDog2]
let viewModel = DogsListViewModel(apiClient: mockAPI)
```

### Android - Hilt DI (Future)

```kotlin
// Define module
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideAPIClient(retrofit: Retrofit, authManager: AuthManager): APIClient {
        return APIClient(retrofit, authManager)
    }
}

// ViewModel with injection
@HiltViewModel
class DogsListViewModel @Inject constructor(
    private val apiClient: APIClient
) : ViewModel() {
    // ...
}

// Activity/Fragment
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    // Hilt handles injection
}
```

---

## 🔒 Security Standards

### 1. Authentication Token Storage

**iOS - Keychain:**
```swift
class KeychainManager {
    static let shared = KeychainManager()

    func save(token: String, key: String) {
        let data = token.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]

        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    func get(key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]

        var result: AnyObject?
        SecItemCopyMatching(query as CFDictionary, &result)

        guard let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    func delete(key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
    }
}

// Usage
KeychainManager.shared.save(token: accessToken, key: "accessToken")
let token = KeychainManager.shared.get(key: "accessToken")
```

**Android - EncryptedSharedPreferences:**
```kotlin
class SecureStorage(context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveToken(token: String, key: String) {
        sharedPreferences.edit().putString(key, token).apply()
    }

    fun getToken(key: String): String? {
        return sharedPreferences.getString(key, null)
    }

    fun deleteToken(key: String) {
        sharedPreferences.edit().remove(key).apply()
    }
}
```

### 2. API Security

**Requirements:**
- ✅ HTTPS only in production
- ✅ Certificate pinning (optional, high security)
- ✅ Token expiry handling
- ✅ Automatic token refresh
- ✅ Logout on 401

**iOS Token Refresh:**
```swift
extension APIClient {
    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        var request = try endpoint.urlRequest()
        request.setValue("Bearer \\(AuthManager.shared.accessToken ?? "")", forHTTPHeaderField: "Authorization")

        do {
            return try await execute(request)
        } catch APIError.unauthorized {
            // Try to refresh token
            try await AuthManager.shared.refreshToken()

            // Retry original request with new token
            request.setValue("Bearer \\(AuthManager.shared.accessToken ?? "")", forHTTPHeaderField: "Authorization")
            return try await execute(request)
        }
    }
}
```

### 3. Data Validation

**Client-side validation (before API call):**
```swift
struct Validator {
    static func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        return NSPredicate(format: "SELF MATCHES %@", emailRegex).evaluate(with: email)
    }

    static func isValidPassword(_ password: String) -> Bool {
        return password.count >= 8
    }

    static func isValidPhoneNumber(_ phone: String) -> Bool {
        let phoneRegex = "^\\d{10}$"
        return NSPredicate(format: "SELF MATCHES %@", phoneRegex).evaluate(with: phone)
    }
}
```

---

## 📊 Analytics & Monitoring

### Event Tracking

**iOS:**
```swift
enum AnalyticsEvent {
    case screenView(screenName: String)
    case dogCreated
    case activityLogged(type: String)
    case error(message: String)

    var name: String {
        switch self {
        case .screenView: return "screen_view"
        case .dogCreated: return "dog_created"
        case .activityLogged: return "activity_logged"
        case .error: return "error"
        }
    }

    var properties: [String: Any] {
        switch self {
        case .screenView(let screenName):
            return ["screen_name": screenName]
        case .activityLogged(let type):
            return ["activity_type": type]
        case .error(let message):
            return ["message": message]
        default:
            return [:]
        }
    }
}

class AnalyticsManager {
    static let shared = AnalyticsManager()

    func track(_ event: AnalyticsEvent) {
        // Firebase Analytics
        Analytics.logEvent(event.name, parameters: event.properties)

        // Console logging in debug
        #if DEBUG
        print("📊 Analytics: \\(event.name) - \\(event.properties)")
        #endif
    }
}
```

### Error Tracking

**iOS - Sentry:**
```swift
import Sentry

// In AppDelegate or @main
SentrySDK.start { options in
    options.dsn = "YOUR_SENTRY_DSN"
    options.environment = Environment.current.rawValue // dev/staging/prod
    options.tracesSampleRate = 1.0
}

// Usage
do {
    try await riskyOperation()
} catch {
    SentrySDK.capture(error: error)
    throw error
}
```

---

## 🚀 Performance Optimization

### 1. List Performance (Large Datasets)

**iOS - LazyVStack:**
```swift
ScrollView {
    LazyVStack(spacing: 12) {
        ForEach(viewModel.dogs) { dog in
            DogCardView(dog: dog)
                .onAppear {
                    // Pagination trigger
                    if dog == viewModel.dogs.last {
                        Task { await viewModel.loadMore() }
                    }
                }
        }
    }
}
```

**Android - LazyColumn:**
```kotlin
LazyColumn {
    items(dogs) { dog ->
        DogCard(dog = dog)
    }

    item {
        if (hasMore && !isLoading) {
            LaunchedEffect(Unit) {
                viewModel.loadMore()
            }
        }
    }
}
```

### 2. Image Loading & Caching

**iOS - AsyncImage with caching:**
```swift
struct CachedAsyncImage: View {
    let url: String

    var body: some View {
        AsyncImage(url: URL(string: url)) { phase in
            switch phase {
            case .empty:
                ProgressView()
            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            case .failure:
                Image(systemName: "photo")
                    .foregroundColor(.gray)
            @unknown default:
                EmptyView()
            }
        }
    }
}
```

**Android - Coil:**
```kotlin
@Composable
fun CachedAsyncImage(url: String) {
    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(url)
            .crossfade(true)
            .build(),
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = Modifier.fillMaxWidth()
    )
}
```

### 3. State Management Optimization

**Avoid unnecessary re-renders:**

**iOS:**
```swift
// ❌ Bad - entire view re-renders on any state change
@StateObject var viewModel = DogsListViewModel()

var body: some View {
    Text("Dogs: \\(viewModel.dogs.count)")
    Text("Loading: \\(viewModel.isLoading)")
}

// ✅ Good - only affected views re-render
@StateObject var viewModel = DogsListViewModel()

var body: some View {
    DogCountView(count: viewModel.dogs.count)
    LoadingView(isLoading: viewModel.isLoading)
}
```

---

## ♿ Accessibility Standards

### 1. VoiceOver/TalkBack Support

**iOS:**
```swift
Button(action: { viewModel.deleteDog(dog.id) }) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete \\(dog.name)")
.accessibilityHint("Removes this dog from your profile")

Image(dog.photoUrl)
    .accessibilityLabel("Photo of \\(dog.name), a \\(dog.breed)")
```

**Android:**
```kotlin
IconButton(
    onClick = { viewModel.deleteDog(dog.id) },
    modifier = Modifier.semantics {
        contentDescription = "Delete ${dog.name}"
        role = Role.Button
    }
) {
    Icon(Icons.Default.Delete, contentDescription = null)
}
```

### 2. Dynamic Type

**iOS - Automatic:**
```swift
Text("Hello")
    .font(.body) // Automatically scales with user's text size preference
```

**Android:**
```kotlin
Text(
    text = "Hello",
    style = MaterialTheme.typography.bodyLarge // Respects system font scale
)
```

### 3. Color Contrast

**Ensure WCAG AA compliance:**
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- Use online checkers: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 📁 Project Structure

### iOS
```
PookieBear/
├── App/
│   ├── PookieBearApp.swift
│   └── Config/
│       ├── Environment.swift
│       └── Constants.swift
├── Models/
│   ├── Dog.swift
│   ├── User.swift
│   ├── Activity.swift
│   └── ...
├── ViewModels/
│   ├── DogsListViewModel.swift
│   ├── ActivityViewModel.swift
│   └── ...
├── Views/
│   ├── Authentication/
│   ├── Dashboard/
│   ├── Dogs/
│   ├── Activity/
│   ├── Health/
│   └── Components/
│       ├── ClayButton.swift
│       ├── ClayCard.swift
│       └── ...
├── Services/
│   ├── APIClient.swift
│   ├── AuthenticationManager.swift
│   ├── AnalyticsManager.swift
│   └── ...
├── Utilities/
│   ├── Extensions/
│   ├── Validators.swift
│   └── ...
└── Resources/
    ├── Assets.xcassets
    ├── Fonts/
    └── Localizable.strings
```

### Android (Future)
```
app/src/main/java/com/pookie/
├── PookieApplication.kt
├── di/
│   ├── AppModule.kt
│   └── NetworkModule.kt
├── data/
│   ├── models/
│   │   ├── Dog.kt
│   │   ├── User.kt
│   │   └── ...
│   ├── api/
│   │   └── PookieAPI.kt
│   └── repository/
│       └── DogsRepository.kt
├── domain/
│   └── usecases/
├── ui/
│   ├── theme/
│   │   ├── Color.kt
│   │   ├── Type.kt
│   │   └── Theme.kt
│   ├── auth/
│   ├── dashboard/
│   ├── dogs/
│   │   ├── DogsListScreen.kt
│   │   └── DogsListViewModel.kt
│   └── components/
│       ├── ClayButton.kt
│       └── ...
└── utils/
    ├── Extensions.kt
    └── Validators.kt
```

---

## ✅ Code Review Checklist

Before merging any code, verify:

### Architecture
- [ ] Follows MVVM pattern strictly
- [ ] No business logic in Views
- [ ] ViewModels are testable (dependency injection)
- [ ] Services are decoupled

### Performance
- [ ] No blocking main thread
- [ ] Lists use lazy loading
- [ ] Images are cached
- [ ] No unnecessary re-renders

### Testing
- [ ] Unit tests for ViewModels
- [ ] Unit tests for Services
- [ ] UI tests for critical flows
- [ ] Code coverage meets targets

### Accessibility
- [ ] VoiceOver labels added
- [ ] Color contrast verified
- [ ] Supports dynamic type
- [ ] Tested with accessibility features

### Security
- [ ] No hardcoded secrets
- [ ] Tokens stored in Keychain/EncryptedPrefs
- [ ] Input validation implemented
- [ ] HTTPS enforced

### Code Quality
- [ ] Follows naming conventions
- [ ] Commented where necessary
- [ ] No compiler warnings
- [ ] Linter passes
- [ ] No duplicate code

---

## 🎓 Learning Resources

### iOS
- [SwiftUI by Example](https://www.hackingwithswift.com/quick-start/swiftui)
- [Combine Framework](https://developer.apple.com/documentation/combine)
- [MVVM in SwiftUI](https://www.swiftbysundell.com/articles/mvvm-in-swift/)

### Android
- [Jetpack Compose](https://developer.android.com/jetpack/compose/documentation)
- [Android Architecture Components](https://developer.android.com/topic/architecture)
- [Hilt Dependency Injection](https://developer.android.com/training/dependency-injection/hilt-android)

### Cross-Platform Concepts
- [Mobile App Architecture](https://www.raywenderlich.com/books/advanced-ios-app-architecture)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Remember:** These standards exist to make your code maintainable, testable, and scalable. When iOS is polished, Android will be a breeze because the architecture is already proven! 🚀
