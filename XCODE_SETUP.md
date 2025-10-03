# 📱 Opening Pookie Bear in Xcode - Step by Step

## Prerequisites

✅ You have Xcode installed (from Mac App Store)
✅ Backend is running: `cd pookiebear-backend && npm run dev`

---

## Method 1: Create New Xcode Project (Recommended)

This is the easiest way to get the app running in the simulator.

### Step 1: Open Xcode

1. Open **Xcode** from Applications or Spotlight
2. If you see a welcome window, click **"Create New Project"**
3. Or go to **File → New → Project** (⌘⇧N)

### Step 2: Choose Template

1. Select **iOS** at the top
2. Choose **App** template
3. Click **Next**

### Step 3: Configure Project

Fill in these details:

| Field | Value |
|-------|-------|
| **Product Name** | `PookieBear` |
| **Team** | (Leave as None, or select your team) |
| **Organization Identifier** | `com.yourname.pookiebear` |
| **Bundle Identifier** | (Auto-generated) |
| **Interface** | **SwiftUI** ✅ |
| **Language** | **Swift** ✅ |
| **Storage** | None |
| **Include Tests** | (Optional - you can check or uncheck) |

Click **Next**

### Step 4: Choose Location

1. **IMPORTANT:** Navigate to this folder:
   ```
   /Users/alexhoward/CascadeProjects/windsurf-project-3/PookieBear-iOS
   ```

2. **UNCHECK** "Create Git repository on my Mac"

3. Click **Create**

### Step 5: Add Swift Files

Now you need to add all the Swift code files.

#### A. Clean Up Default Files

1. In Xcode's left sidebar (Project Navigator), find `ContentView.swift`
2. Right-click → **Delete**
3. Choose **Move to Trash**

#### B. Add App File

1. Right-click on the **PookieBear** folder (blue icon)
2. Choose **Add Files to "PookieBear"...**
3. Navigate to: `PookieBear/PookieBearApp.swift`
4. **CHECK** "Copy items if needed"
5. **CHECK** "Create groups"
6. **Ensure** Target "PookieBear" is checked
7. Click **Add**

#### C. Create Folder Structure

For each of these folders:
- Models
- Services
- Views
- ViewModels

Do this:

1. Right-click on **PookieBear** folder
2. Choose **New Group**
3. Name it (e.g., "Models")
4. Right-click the new group
5. Choose **Add Files to "PookieBear"...**
6. Navigate to the corresponding `PookieBear/[FolderName]/` folder
7. Select **all .swift files** in that folder
8. **CHECK** "Copy items if needed"
9. Click **Add**

**Folders to create and populate:**

```
PookieBear (project root)
├── Models/
│   ├── User.swift
│   ├── Dog.swift
│   └── Activity.swift
│
├── Services/
│   ├── APIClient.swift
│   └── AuthenticationManager.swift
│
├── Views/
│   ├── Authentication/
│   │   ├── WelcomeView.swift
│   │   ├── LoginView.swift
│   │   └── RegisterView.swift
│   ├── Dashboard/
│   │   └── DashboardView.swift
│   ├── Dogs/
│   │   └── DogsListView.swift
│   ├── Activity/
│   │   └── ActivityView.swift
│   └── MainTabView.swift
│
└── ViewModels/
    ├── DashboardViewModel.swift
    └── DogsListViewModel.swift
```

### Step 6: Configure Info.plist

1. In Xcode, click on the **PookieBear** project (blue icon at top of sidebar)
2. Select the **PookieBear** target
3. Click the **Info** tab
4. Right-click in the properties list → **Add Row**

Add these entries:

**Privacy - Location When In Use Usage Description**
- Type: `String`
- Value: `We need your location to track walks and find nearby vets.`

**Privacy - Camera Usage Description**
- Type: `String`
- Value: `We need camera access to take photos of your dog.`

**Privacy - Photo Library Usage Description**
- Type: `String`
- Value: `We need photo library access to select photos of your dog.`

**App Transport Security Settings** (for localhost access)
- Type: `Dictionary`
- Add two sub-entries:
  - **Allow Arbitrary Loads** → Boolean → YES
  - **Allow Local Networking** → Boolean → YES

Your Info.plist should look like this:

```
Information Property List
├─ Privacy - Location When In Use Usage Description: "We need your..."
├─ Privacy - Camera Usage Description: "We need camera access..."
├─ Privacy - Photo Library Usage Description: "We need photo library..."
└─ App Transport Security Settings
   ├─ Allow Arbitrary Loads: YES
   └─ Allow Local Networking: YES
```

### Step 7: Verify Files

1. Press ⌘1 to open Project Navigator
2. Expand all folders
3. Make sure you see all 15 Swift files
4. Each file should have a ✓ next to it (means it's in the target)

### Step 8: Build and Run!

1. At the top of Xcode, click the **device selector** (next to play button)
2. Choose **iPhone 15 Pro** (or any iPhone simulator)
3. Click the **Play** button (▶️) or press **⌘R**
4. Wait for build (30-60 seconds first time)
5. Simulator launches automatically
6. App opens! 🎉

---

## Method 2: Command Line Setup (Advanced)

If you're comfortable with command line:

```bash
# Navigate to iOS folder
cd /Users/alexhoward/CascadeProjects/windsurf-project-3/PookieBear-iOS

# The project needs to be created in Xcode
# But you can verify files are ready:
find PookieBear -name "*.swift" -type f
# Should show 15 files

# Then open Xcode and follow Method 1 steps
```

---

## Common Issues & Solutions

### ❌ "No such module 'SwiftUI'"

**Solution:**
- Xcode → Preferences → Locations
- Command Line Tools → Select your Xcode version

### ❌ Build fails with "Cannot find type 'XXX'"

**Solution:**
1. Check that all Swift files are added
2. Each file should have ✓ in File Inspector
3. Clean build folder: ⌘⇧K
4. Rebuild: ⌘B

### ❌ "Cannot connect to localhost:3000"

**Solution:**
1. Check backend is running:
   ```bash
   curl http://localhost:3000/health
   ```
2. Verify Info.plist has "Allow Local Networking"
3. Simulator can access localhost (your Mac's localhost)

### ❌ Simulator won't launch

**Solution:**
1. Xcode → Window → Devices and Simulators
2. Click **+** to add a simulator
3. Choose iPhone 15 Pro
4. Try again

### ❌ Too many errors to fix

**Solution:**
- **Start fresh**: Delete project and follow Method 1 again
- Make sure you're using **SwiftUI** (not UIKit)
- Verify Xcode is updated to latest version

---

## Verification Checklist

Before running, verify:

- [ ] Xcode project created with SwiftUI
- [ ] All 15 Swift files added
- [ ] All files have ✓ (included in target)
- [ ] Info.plist configured with privacy keys
- [ ] Info.plist allows local networking
- [ ] Backend server is running (npm run dev)
- [ ] Simulator selected (iPhone 15 Pro)

If all checked, click Play! ▶️

---

## Testing the App

### First Launch

1. **Welcome Screen** appears with:
   - Pookie Bear logo (paw print)
   - "Sign In" button
   - "Create Account" button

2. **Tap "Create Account"**

3. **Fill Registration Form:**
   ```
   First Name: Test
   Last Name: User
   Email: test@example.com
   Password: password123
   Confirm Password: password123
   ```

4. **Tap "Create Account"**

5. **You're in!** Dashboard appears

### Explore the App

**Dashboard Tab:**
- See your greeting
- "Add Your First Dog" card
- Quick action buttons
- Pull down to refresh

**My Dogs Tab:**
- Empty initially (add via API)
- Shows list when dogs exist

**Activity Tab:**
- "Coming soon" placeholder

**Health Tab:**
- "Coming soon" placeholder

**Profile Tab:**
- Your name and email
- Subscription status
- Sign Out button

---

## Adding Test Data

To see dogs in the app, create them via API:

```bash
# Terminal 1: Backend running
cd pookiebear-backend
npm run dev

# Terminal 2: Create test data
# Login first
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copy the accessToken
export TOKEN="paste_token_here"

# Create a dog
curl -X POST http://localhost:3000/api/v1/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Max",
    "breed": "Golden Retriever",
    "dateOfBirth": "2020-05-15",
    "gender": "male",
    "weightLbs": 65.5,
    "neuteredSpayed": true,
    "energyLevel": "high"
  }'
```

Then in the app:
1. Go to **My Dogs** tab
2. **Pull down to refresh**
3. See your dog appear!

---

## Keyboard Shortcuts

While using Xcode:

| Action | Shortcut |
|--------|----------|
| Build | ⌘B |
| Run | ⌘R |
| Stop | ⌘. |
| Clean Build | ⌘⇧K |
| Project Navigator | ⌘1 |
| Find in Files | ⌘⇧F |
| Open Quickly | ⌘⇧O |

In Simulator:

| Action | Shortcut |
|--------|----------|
| Home | ⌘⇧H |
| Lock | ⌘L |
| Rotate Left | ⌘← |
| Rotate Right | ⌘→ |
| Shake | ⌃⌘Z |

---

## Next Steps

Once running in simulator:

1. ✅ **Test Authentication**
   - Create account
   - Sign out
   - Sign in

2. ✅ **Test Navigation**
   - All 5 tabs
   - Dog detail view

3. 🔜 **Add Features**
   - Create "Add Dog" form
   - Implement photo upload
   - Build GPS walk tracking

4. 🔜 **Test on Real Device**
   - Connect iPhone via USB
   - Select device in Xcode
   - Trust certificate on device

---

## Help & Resources

- **SwiftUI Tutorial:** https://developer.apple.com/tutorials/swiftui
- **Xcode Guide:** https://developer.apple.com/documentation/xcode
- **Backend API Docs:** `../pookiebear-backend/README.md`
- **Test Commands:** `../pookiebear-backend/TESTING.md`

---

## Summary

**To run in simulator:**

1. Open Xcode
2. Create new iOS App project "PookieBear" with SwiftUI
3. Add all 15 Swift files
4. Configure Info.plist
5. Select iPhone 15 Pro simulator
6. Click Play ▶️
7. Create account and explore!

**Total time:** 10-15 minutes

**Result:** Fully functional iOS app running in simulator! 🎉

---

Need help? Check GETTING_STARTED.md for complete setup guide!