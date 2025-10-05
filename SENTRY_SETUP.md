# 🔍 Sentry Error Monitoring Setup Guide

## Overview
Error monitoring is currently configured but not yet connected to Sentry. This guide shows how to integrate when ready.

## Current Status
✅ Error monitoring framework in place
✅ Environment-based enabling (disabled in dev, enabled in staging/prod)
✅ Error reporting methods ready
✅ Breadcrumb tracking ready
⏳ Waiting for Sentry SDK integration

## When to Add Sentry
- Before deploying to TestFlight
- Before App Store submission
- When you want production error tracking

## Setup Steps

### 1. Create Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up (free tier available)
3. Create new project: "PookieBear iOS"
4. Get your DSN (will look like: `https://xxxxx@sentry.io/xxxxx`)

### 2. Add Sentry SDK to iOS

**Option A: Swift Package Manager (Recommended)**
1. In Xcode, go to: File → Add Packages...
2. Enter: `https://github.com/getsentry/sentry-cocoa.git`
3. Select version 8.x.x (latest)
4. Add to PookieBear target

**Option B: CocoaPods**
```ruby
# Podfile
pod 'Sentry', '~> 8.0'
```

### 3. Update ErrorMonitoring.swift

Uncomment and update the Sentry code in `Services/ErrorMonitoring.swift`:

```swift
import Sentry  // Add at top

func configure() {
    guard isEnabled else {
        print("ℹ️ Error monitoring disabled...")
        return
    }

    // Uncomment and configure:
    SentrySDK.start { options in
        options.dsn = "YOUR_SENTRY_DSN_HERE"  // Replace with your DSN
        options.environment = Environment.current.displayName.lowercased()
        options.tracesSampleRate = 1.0
        options.debug = Environment.current.isDebugMode
        
        // Optional: Enable performance monitoring
        options.enableAutoPerformanceTracing = true
        
        // Optional: Attach screenshots on errors
        options.attachScreenshot = true
        
        // Optional: Sample rate for profiling
        options.profilesSampleRate = 1.0
    }

    print("✅ Sentry configured...")
}

func captureError(_ error: Error, context: [String: Any]? = nil) {
    guard isEnabled else { return }

    SentrySDK.capture(error: error) { scope in
        if let context = context {
            scope.setContext(value: context, key: "additional_info")
        }
    }
}

func captureMessage(_ message: String, level: ErrorLevel = .info, context: [String: Any]? = nil) {
    guard isEnabled else { return }

    let sentryLevel: SentryLevel
    switch level {
    case .debug: sentryLevel = .debug
    case .info: sentryLevel = .info
    case .warning: sentryLevel = .warning
    case .error: sentryLevel = .error
    case .fatal: sentryLevel = .fatal
    }

    SentrySDK.capture(message: message) { scope in
        scope.level = sentryLevel
        if let context = context {
            scope.setContext(value: context, key: "additional_info")
        }
    }
}

func setUser(_ user: User) {
    guard isEnabled else { return }

    let sentryUser = Sentry.User(userId: user.id)
    sentryUser.email = user.email
    sentryUser.username = user.fullName
    SentrySDK.setUser(sentryUser)
}

func clearUser() {
    guard isEnabled else { return }
    SentrySDK.setUser(nil)
}

func addBreadcrumb(message: String, category: String = "default", level: ErrorLevel = .info) {
    guard isEnabled else { return }

    let crumb = Breadcrumb(level: level.sentryLevel, category: category)
    crumb.message = message
    crumb.timestamp = Date()
    SentrySDK.addBreadcrumb(crumb)
}
```

Add helper for ErrorLevel:
```swift
extension ErrorLevel {
    var sentryLevel: SentryLevel {
        switch self {
        case .debug: return .debug
        case .info: return .info
        case .warning: return .warning
        case .error: return .error
        case .fatal: return .fatal
        }
    }
}
```

### 4. Update AuthenticationManager

Add user tracking on login:

```swift
func login(email: String, password: String) async throws {
    let response = try await APIClient.shared.login(email: email, password: password)
    await MainActor.run {
        self.saveAuthResponse(response)
        // Add this:
        ErrorMonitoring.shared.setUser(response.user)
    }
}

func logout() {
    // Add this before clearing:
    ErrorMonitoring.shared.clearUser()
    
    accessToken = nil
    refreshToken = nil
    // ... rest of logout
}
```

### 5. Add to .gitignore

```
# Sentry
.sentryclirc
sentry.properties
```

### 6. Environment Variables

Add to your environment configs:

```swift
// In Environment.swift
var sentryDSN: String? {
    switch self {
    case .development:
        return nil  // Don't send dev errors to Sentry
    case .staging:
        return "YOUR_STAGING_SENTRY_DSN"
    case .production:
        return "YOUR_PRODUCTION_SENTRY_DSN"
    }
}
```

Then in ErrorMonitoring.configure():
```swift
if let dsn = Environment.current.sentryDSN {
    options.dsn = dsn
} else {
    return  // Skip Sentry in dev
}
```

## Backend Setup (Optional)

For Node.js backend:

```bash
cd pookiebear-backend
npm install @sentry/node @sentry/profiling-node
```

In `app.ts`:
```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Add before routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Add before error handlers (at the end)
app.use(Sentry.Handlers.errorHandler());
```

## Testing Sentry

After setup, test error reporting:

```swift
// In any view, add a test button:
Button("Test Error Monitoring") {
    let testError = NSError(domain: "TestError", code: 999, userInfo: [
        NSLocalizedDescriptionKey: "This is a test error"
    ])
    ErrorMonitoring.report(testError, context: ["test": "true"])
}
```

Check your Sentry dashboard - you should see the error within seconds!

## Cost

- **Free Tier**: 5,000 errors/month
- **Team Plan**: $26/month for 50,000 errors
- Plenty for MVP and early growth!

## Alternative: Firebase Crashlytics

If you prefer Firebase:
1. Add Firebase SDK
2. Replace Sentry calls with Crashlytics
3. Free tier is generous
4. Good for startups

## Current Behavior (Without Sentry)

Right now, errors are:
- ✅ Logged to console in development
- ✅ Structured with context
- ✅ Ready for Sentry integration
- ⏳ Not sent anywhere in production

This is fine for development, but add Sentry before production launch!
