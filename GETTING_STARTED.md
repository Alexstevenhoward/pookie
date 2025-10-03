# 🚀 Pookie Bear - Complete Getting Started Guide

## What You Have Now

✅ **Backend API** - Complete Node.js/Express REST API with PostgreSQL
✅ **iOS App** - SwiftUI mobile app with authentication, dashboard, and dog management
✅ **Full Documentation** - Setup guides, API docs, and testing instructions

## 📋 Prerequisites

Before you start, you need:

1. **Xcode** (for iOS simulator)
   - Download from Mac App Store (free)
   - Size: ~15GB, takes ~30 minutes to install

2. **Node.js** (already have it since you installed packages)
   - ✅ You already have this!

3. **PostgreSQL** (for database)
   - Need to install if you haven't

---

## 🎯 Step-by-Step Setup (15 minutes)

### Step 1: Install PostgreSQL (5 minutes)

Choose ONE method:

#### Option A: Homebrew (Recommended)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb pookiebear_db
```

#### Option B: Postgres.app (GUI)
1. Download from https://postgresapp.com/
2. Install and open Postgres.app
3. Click "Initialize" to start server
4. Click on any database, run: `CREATE DATABASE pookiebear_db;`

#### Option C: Docker
```bash
docker run --name pookiebear-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pookiebear_db -p 5432:5432 -d postgres:14
```

### Step 2: Start the Backend API (2 minutes)

```bash
# Navigate to backend directory
cd /Users/alexhoward/CascadeProjects/windsurf-project-3/pookiebear-backend

# Install dependencies (if not done)
npm install

# Start the server
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

**Test it:**
```bash
# In a new terminal
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"healthy","timestamp":"...","uptime":...}
```

**Leave this terminal window open!** The backend needs to keep running.

### Step 3: Install Xcode (if not installed)

1. Open **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **Get/Install** (it's free)
4. Wait ~30 minutes for download and install

### Step 4: Create Xcode Project (5 minutes)

**Important:** The Swift files are created, but you need to create an Xcode project to run them.

1. **Open Xcode**

2. **Create new project:**
   - File → New → Project (or Cmd+Shift+N)
   - Choose **iOS** → **App**
   - Click **Next**

3. **Configure project:**
   - Product Name: `PookieBear`
   - Team: Leave as-is or select your team
   - Organization Identifier: `com.yourname.pookiebear`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: None
   - Include Tests: Optional
   - Click **Next**

4. **Save location:**
   - Navigate to: `/Users/alexhoward/CascadeProjects/windsurf-project-3/PookieBear-iOS`
   - **IMPORTANT:** Uncheck "Create Git repository"
   - Click **Create**

5. **Add all the Swift files:**

   a. Delete the default `ContentView.swift` file (right-click → Delete → Move to Trash)

   b. Add the app file:
   - Right-click on `PookieBear` folder in Xcode
   - "Add Files to PookieBear..."
   - Navigate to `PookieBear/` folder
   - Select `PookieBearApp.swift`
   - **CHECK** "Copy items if needed"
   - Click Add

   c. Create folder structure and add files:
   - Right-click `PookieBear` → New Group → Name it `Models`
   - Right-click `Models` → Add Files
   - Select all files from `PookieBear/Models/`
   - Repeat for: `Services`, `Views`, `ViewModels`

### Step 5: Configure Info.plist

1. In Xcode, click on the `PookieBear` project (blue icon at top)
2. Select the `PookieBear` target
3. Go to **Info** tab
4. Add these keys:

**Custom iOS Target Properties:**

| Key | Type | Value |
|-----|------|-------|
| Privacy - Location When In Use | String | We need your location to track walks |
| Privacy - Camera Usage | String | We need camera access for photos |
| Privacy - Photo Library Usage | String | We need to access your photos |
| App Transport Security Settings | Dictionary | |
| └ Allow Arbitrary Loads | Boolean | YES |
| └ Allow Local Networking | Boolean | YES |

### Step 6: Run in Simulator! 🎉

1. **Select a simulator:**
   - At the top of Xcode, click the device dropdown
   - Choose **iPhone 15 Pro** (or any iPhone model)

2. **Build and Run:**
   - Click the **Play** button (▶️) in top-left
   - Or press `Cmd + R`

3. **Wait for build:**
   - First build takes ~30 seconds
   - Simulator will launch automatically
   - App will open!

---

## 🎉 Using the App

### First Time Setup

1. **Welcome Screen** appears
2. Click **"Create Account"**
3. Fill in the form:
   ```
   First Name: Test
   Last Name: User
   Email: test@example.com
   Password: password123
   Confirm Password: password123
   ```
4. Click **"Create Account"**
5. You're logged in! 🎊

### What You Can Do

✅ **View Dashboard**
   - See welcome message
   - View activity summary
   - Quick actions

✅ **View Your Dogs**
   - Tab bar → "My Dogs"
   - See list of dogs

✅ **View Profile**
   - Tab bar → "Profile"
   - See your user info
   - Sign out

### Testing with Data

To see dogs in the app, create them via API:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Save the accessToken, then:
export TOKEN="your_access_token_here"

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
    "neuteredSpayed": true
  }'
```

Then **pull to refresh** in the app to see your new dog!

---

## 🔧 Troubleshooting

### Backend won't start

**Error:** `Database connection failed`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running:
brew services start postgresql@14

# Create database if missing
createdb pookiebear_db
```

### Xcode won't build

**Error:** `No such module 'SwiftUI'`

**Solution:**
- Xcode → Preferences → Locations → Command Line Tools
- Select your Xcode version

### Simulator won't connect to backend

**Error:** `URLSession failed: connection refused`

**Solution:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Simulator should be able to access `localhost` (Mac's localhost)
3. Make sure Info.plist has local networking enabled

### App crashes on launch

**Solution:**
1. Check Xcode console for errors
2. Make sure all Swift files are added to target
3. Clean build folder: Xcode → Product → Clean Build Folder (Cmd+Shift+K)

---

## 📁 Project Structure

```
windsurf-project-3/
├── pookiebear-backend/          # Backend API
│   ├── src/
│   │   ├── controllers/         # API endpoints
│   │   ├── entities/            # Database models
│   │   ├── routes/              # Route definitions
│   │   └── services/            # Business logic
│   ├── README.md                # Backend docs
│   ├── SETUP.md                 # Quick setup
│   └── TESTING.md               # API testing
│
├── PookieBear-iOS/              # iOS App
│   ├── PookieBear/
│   │   ├── Models/              # Data models
│   │   ├── Services/            # API & Auth
│   │   ├── Views/               # SwiftUI views
│   │   └── ViewModels/          # View logic
│   └── README.md                # iOS setup
│
├── BACKEND_SUMMARY.md           # What was built
└── GETTING_STARTED.md           # This file!
```

---

## 📚 Next Steps

### Implement More Features

1. **Add Dog Feature**
   - Create AddDogView.swift
   - Form to input dog details
   - POST to API

2. **GPS Walk Tracking**
   - Use Core Location
   - Track coordinates
   - Display route on map

3. **Photo Upload**
   - Image picker
   - Upload to backend/S3
   - Display in dog profile

4. **Health Records**
   - Vet visit forms
   - Vaccination tracking
   - Medication management

### Deploy to Production

1. **Backend:**
   - Deploy to AWS/Heroku/Railway
   - Set up production database
   - Configure environment variables

2. **iOS:**
   - Change API endpoint to production URL
   - Submit to App Store
   - Configure production certificates

---

## ✅ Verification Checklist

Before running the app, verify:

- [ ] PostgreSQL is installed and running
- [ ] Backend is running (npm run dev)
- [ ] Backend health check works (curl localhost:3000/health)
- [ ] Xcode is installed
- [ ] Xcode project is created
- [ ] All Swift files are added to project
- [ ] Info.plist is configured
- [ ] Simulator is selected in Xcode

---

## 🎯 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd pookiebear-backend
npm run dev

# Terminal 2: Test Backend
curl http://localhost:3000/health

# Terminal 3: Create test data
cd pookiebear-backend
# Follow TESTING.md for curl commands
```

Then open Xcode and run! 🚀

---

## 📞 Help & Resources

- **Backend API Docs:** `pookiebear-backend/README.md`
- **Backend Testing:** `pookiebear-backend/TESTING.md`
- **iOS Setup:** `PookieBear-iOS/README.md`
- **Backend Summary:** `BACKEND_SUMMARY.md`

## 🎊 You're Ready!

You now have a complete dog care management app:
- ✅ Backend API with authentication, dogs, health, activities
- ✅ iOS app with beautiful UI and backend integration
- ✅ Running in iPhone simulator
- ✅ Ready for further development

**Have fun building Pookie Bear!** 🐾