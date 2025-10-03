# Pookie Bear iOS App

Complete iOS application for dog care management built with SwiftUI.

## 🎯 Requirements

- macOS with Xcode 15.0+
- iOS 16.0+ target
- Swift 5.9+
- Running backend API (see ../pookiebear-backend)

## 🚀 Quick Start

### Step 1: Install Xcode

If you don't have Xcode installed:

1. Open the **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **Install** (it's free, ~15GB download)
4. Wait for installation to complete (~30 minutes)

### Step 2: Start the Backend API

The iOS app needs the backend running:

```bash
# In a new terminal window
cd ../pookiebear-backend
npm run dev
```

Backend should be running on `http://localhost:3000`

### Step 3: Open in Xcode

**Important:** The project files are created but need to be opened properly in Xcode.

#### Option A: Create New Xcode Project (Recommended)

1. **Open Xcode**
2. **Create a new Xcode project**:
   - Choose **iOS** → **App**
   - Product Name: **PookieBear**
   - Team: Your team (or leave as none for simulator)
   - Organization Identifier: `com.yourname.pookiebear`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Save location: Choose this directory

3. **Replace the generated files** with the ones in the `PookieBear` folder:
   - Copy all files from `PookieBear/` to your new Xcode project
   - Replace `PookieBearApp.swift` and other files

4. **Add files to Xcode project**:
   - Right-click on the PookieBear folder in Xcode
   - Select **Add Files to "PookieBear"...**
   - Select all the `.swift` files from:
     - Models/
     - Services/
     - Views/
     - ViewModels/
   - Make sure "Copy items if needed" is **unchecked**
   - Click **Add**

#### Option B: Manual File Copy

1. Open Xcode
2. Create new iOS App project named "PookieBear"
3. In Finder, copy all `.swift` files to the Xcode project
4. In Xcode, right-click and add files to project

### Step 4: Configure for Simulator

1. In Xcode, select a simulator from the device dropdown (e.g., **iPhone 15 Pro**)
2. Click the **Play** button (▶️) or press `Cmd + R`
3. Wait for the app to build and launch in the simulator

### Step 5: Test the App

1. App will open to the Welcome screen
2. Click **"Create Account"**
3. Fill in registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click **"Create Account"**
5. You should be logged in and see the Dashboard!

## 📱 Features

### ✅ Implemented
- **Authentication**
  - Login with email/password
  - Registration
  - Auto-login with saved credentials
  - Logout

- **Dashboard**
  - User greeting
  - Dog cards carousel
  - Quick actions
  - Today's activity summary
  - Upcoming reminders

- **Dog Management**
  - View all dogs
  - Dog detail view
  - Dog profile information

- **Profile**
  - View user information
  - Subscription tier display
  - Sign out

### 🔜 Coming Soon
- Add/Edit dog profiles
- GPS walk tracking
- Activity logging
- Health records management
- Photo uploads
- Push notifications

## 🏗️ Project Structure

```
PookieBear/
├── PookieBearApp.swift           # App entry point
├── Models/
│   ├── User.swift                # User data models
│   ├── Dog.swift                 # Dog data models
│   └── Activity.swift            # Activity data models
├── Services/
│   ├── APIClient.swift           # Backend API client
│   └── AuthenticationManager.swift # Auth state management
├── Views/
│   ├── Authentication/
│   │   ├── WelcomeView.swift    # Welcome/splash screen
│   │   ├── LoginView.swift      # Login screen
│   │   └── RegisterView.swift   # Registration screen
│   ├── Dashboard/
│   │   └── DashboardView.swift  # Main dashboard
│   ├── Dogs/
│   │   └── DogsListView.swift   # Dog list and detail
│   ├── Activity/
│   │   └── ActivityView.swift   # Activity views
│   └── MainTabView.swift        # Main tab navigation
├── ViewModels/
│   ├── DashboardViewModel.swift
│   └── DogsListViewModel.swift
└── Info.plist                    # App configuration
```

## 🔧 Configuration

### API Endpoint

The app connects to `http://localhost:3000/api/v1` by default.

To change this, edit [`Services/APIClient.swift`](PookieBear/Services/APIClient.swift):

```swift
private let baseURL = "http://your-api-url.com/api/v1"
```

### App Transport Security

The app allows local networking for development. See `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

For production, configure proper HTTPS endpoints.

## 🎨 Design System

### Colors
- Primary: Blue (`Color.blue`)
- Secondary: Purple (`Color.purple`)
- Accent: Orange (`Color.orange`)
- Error: Red (`Color.red`)

### Typography
- Title: `.largeTitle`, `.title`, `.title2`, `.title3`
- Body: `.headline`, `.subheadline`, `.body`
- Caption: `.caption`

### Components
- Cards: 16pt corner radius, system gray background
- Buttons: 56pt height, rounded corners
- Inputs: Plain text field style with gray background

## 🧪 Testing in Simulator

### Test Accounts

Create a test account or use:
- Email: `test@example.com`
- Password: `password123`

### Mock Data

When no dogs exist, the dashboard shows an "Add First Dog" card.

To test with dogs:
1. Use the backend API to create dogs via curl (see backend TESTING.md)
2. Or implement the "Add Dog" feature in the app

## 📦 Dependencies

This app uses **only Apple frameworks**:
- SwiftUI (UI framework)
- Foundation (Core Swift APIs)
- CoreLocation (GPS tracking - ready for implementation)
- UIKit (Image handling)

**No third-party dependencies!** 🎉

## 🐛 Troubleshooting

### "Cannot connect to localhost"

**Simulator Connection Issue:**
```
Error: URLSession error
```

**Solution:**
1. Make sure backend is running: `cd pookiebear-backend && npm run dev`
2. Test backend health: `curl http://localhost:3000/health`
3. In simulator, localhost should work (it accesses your Mac's localhost)

### Build Errors

**Missing files:**
- Make sure all `.swift` files are added to the Xcode target
- Check: Select file → File Inspector → Target Membership

**Swift version:**
- Xcode Preferences → Locations → Command Line Tools (select Xcode)

### Simulator Won't Launch

1. Xcode → Preferences → Components → Download simulator
2. Or select different simulator model
3. Restart Xcode if needed

## 📱 Running on Real Device

### Option 1: Free Provisioning
1. Connect iPhone via USB
2. Xcode → Preferences → Accounts → Add your Apple ID
3. Select your device in Xcode
4. Trust certificate on device: Settings → General → Device Management

### Option 2: Paid Developer Account
1. Enroll in Apple Developer Program ($99/year)
2. Create provisioning profile
3. Configure signing in Xcode

## 🚀 Next Steps

### Features to Implement

1. **Add Dog Flow**
   ```swift
   // Create AddDogView.swift
   // Add navigation from DogsListView
   ```

2. **GPS Walk Tracking**
   ```swift
   // Use Core Location
   // Track route coordinates
   // POST to /api/v1/activities/:dogId/walks
   ```

3. **Photo Upload**
   ```swift
   // Use PHPickerViewController
   // Upload to S3 or backend
   // Update dog.profilePhotoUrl
   ```

4. **Health Records**
   ```swift
   // Create vet visit forms
   // Vaccination tracking
   // Medication management
   ```

## 📚 Resources

- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)

## 🤝 Backend Integration

This app connects to the Pookie Bear Backend API:
- See [`../pookiebear-backend/README.md`](../pookiebear-backend/README.md) for API docs
- See [`../pookiebear-backend/TESTING.md`](../pookiebear-backend/TESTING.md) for test commands

## 📄 License

Proprietary - All rights reserved

---

## Quick Command Reference

```bash
# Start backend
cd pookiebear-backend && npm run dev

# Test backend
curl http://localhost:3000/health

# Create test account via API
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

Enjoy building Pookie Bear! 🐾