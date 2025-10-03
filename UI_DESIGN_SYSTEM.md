# Pookie Bear iOS App - UI Design System

## Overview
The Pookie Bear app uses a clean, modern design system focused on usability, consistency, and delightful user experience.

---

## Color Palette

### Primary Colors
- **Primary Blue**: `Color.blue` - Used for primary actions, links, and brand identity
- **Accent Colors**:
  - Green (`Color.green`) - Activities, playtime
  - Red (`Color.red`) - Health, alerts
  - Orange (`Color.orange`) - Feeding, nutrition
  - Purple (`Color.purple`) - Grooming, care
  - Pink (`Color.pink`) - Daycare, socialization
  - Cyan (`Color.cyan`) - Swimming, water activities

### Neutral Colors
- **Background**: Light gray `Color(red: 0.95, green: 0.95, blue: 0.97)` - Card backgrounds
- **Text Primary**: `.black` - Input fields, important text
- **Text Secondary**: `.secondary` - Helper text, timestamps
- **White**: `.white` - Button text, overlays

### Gradients
- **Dog Card Gradient**:
  - Blue to Purple: `.blue.opacity(0.3)` → `.purple.opacity(0.3)`
  - Used for dog avatars and placeholders

---

## Typography

### Font Hierarchy
1. **Large Title**: `.largeTitle` + `.bold` - Welcome screens
2. **Title**: `.title` + `.bold` - Dashboard greeting
3. **Title 2**: `.title2` + `.bold` - Section headers
4. **Title 3**: `.title3` + `.semibold` - Card titles
5. **Headline**: `.headline` - Button text, important labels
6. **Subheadline**: `.subheadline` - Secondary info
7. **Body**: `.body` - Standard text
8. **Caption**: `.caption` - Timestamps, meta info

### Font Weights
- **Bold**: Primary headings
- **Semibold**: Buttons, section headers
- **Medium**: Form labels
- **Regular**: Body text

---

## Spacing System

### Consistent Spacing Scale
- **4pt**: Tight spacing between related items
- **8pt**: Small gaps (label to field)
- **12pt**: Medium gaps (button groups)
- **16pt**: Standard gaps (list items, form sections)
- **20pt**: Large gaps (major sections)
- **24pt**: Extra large (page sections)
- **32pt**: Page padding, major separators

### Applied Spacing
- **Card padding**: 16-20pt
- **Horizontal margins**: 32pt for forms
- **Vertical spacing**: 16-24pt between sections
- **List item padding**: 4pt vertical

---

## Component Design

### 1. Cards
**Design Pattern**: Rounded rectangles with subtle background

```swift
.padding()
.background(Color(red: 0.95, green: 0.95, blue: 0.97))
.cornerRadius(16)
```

**Used for**:
- Dog cards on dashboard
- Activity summary
- Reminder cards
- Quick action buttons

**Variations**:
- **Small cards**: 12pt corner radius, 12pt padding
- **Standard cards**: 16pt corner radius, 16-20pt padding
- **Large cards**: 16pt corner radius, 32pt padding

### 2. Buttons

#### Primary Button
- Background: `.blue` (solid color)
- Text: `.white` + `.headline`
- Padding: 32pt horizontal, 12-16pt vertical
- Corner radius: 12-16pt

#### Secondary Button
- Background: `.white`
- Text: `.blue`
- Border: 2pt blue stroke
- Same padding and corner radius as primary

#### Icon Button (Quick Actions)
- Icon size: 32pt
- Icon color: Semantic (blue, green, red, etc.)
- Background: Light gray card
- Padding: 20pt vertical
- Corner radius: 16pt

### 3. Form Elements

#### Text Fields
- Style: `.plain` (no default border)
- Text color: `.black` (for visibility)
- Background: Light gray `Color(red: 0.95, green: 0.95, blue: 0.97)`
- Padding: Standard system padding
- Corner radius: 12pt
- Label above field: `.subheadline` + `.medium`

#### Pickers
- Native iOS picker style
- Labels: `.subheadline` + `.medium`

#### Toggles
- Standard iOS toggle
- Label: System font

### 4. Icons

#### System Icons (SF Symbols)
**Activity Types**:
- Walk: `figure.walk`
- Playtime: `tennis.racket`
- Training: `brain.head.profile`
- Swimming: `figure.pool.swim`
- Fetch: `tennisball`
- Park visit: `tree`
- Daycare: `building.2`
- Hiking: `mountain.2`

**UI Elements**:
- Add: `plus`
- Paw print: `pawprint.fill` / `pawprint.circle.fill`
- Health: `heart.fill` / `cross.case.fill`
- Time: `clock`
- Distance: `map`
- Intensity: `bolt.fill`
- Profile: `person.fill` / `person.circle.fill`

#### Icon Containers
- Circular or rounded square backgrounds
- Background color: Icon color at 10% opacity
- Icon size: 50x50pt for list items
- Icon size: 80x80pt for empty states

### 5. Lists

#### Standard List Row
- Height: Auto (based on content)
- Vertical padding: 4-8pt
- Horizontal padding: System default
- Separator: System default

#### Custom List Row (Activity)
```
[Icon Container] [Content] [Timestamp]
     50x50        Flexible    Auto
```

### 6. Navigation

#### Navigation Bar
- Title: `.inline` or `.large` depending on context
- Background: System default
- Tint color: `.blue`

#### Tab Bar
- Accent color: `.blue`
- Icons: SF Symbols
- Labels: Short, clear names

### 7. Empty States

**Design Pattern**:
- Large icon (80x80pt)
- Title (`.title2` + `.bold`)
- Description (`.subheadline` + `.secondary`)
- Call-to-action button

**Spacing**:
- 20pt between elements
- Centered vertically and horizontally
- 32pt horizontal padding for text

---

## Layout Patterns

### 1. Dashboard Layout
```
[Greeting Header]
  ↓ 20pt
[Dog Cards - Horizontal Scroll]
  ↓ 20pt
[Quick Actions - 2x2 Grid]
  ↓ 20pt
[Activity Summary Card]
  ↓ 20pt
[Reminders List]
```

### 2. List View Layout
```
[Navigation Bar with + button]
[Pull-to-refresh]
[Grouped List]
  - Section Header (date)
  - Items
```

### 3. Form Layout
```
[Navigation Bar - Cancel | Save]
[Form]
  - Section("Title")
    - Fields
  - Section("Title")
    - Fields
  - Error Section (conditional)
```

### 4. Detail View Layout
```
[Navigation Bar]
[Scroll View]
  - Hero Section (image/icon)
  - Title
  - Info Grid/List
  - Action Buttons
```

---

## Interaction Patterns

### 1. Modal Sheets
- Used for: Add forms, detail views
- Presentation: `.sheet(isPresented:)`
- Dismissal: Cancel button or programmatic
- Refresh parent on dismiss

### 2. Navigation
- Used for: Deep navigation (dog details)
- Pattern: `NavigationStack` + `NavigationLink`
- Back button: Automatic

### 3. Loading States
- Inline: `ProgressView()` replaces button text
- Full screen: `ProgressView("Loading...")`  in center
- Pull-to-refresh: `.refreshable {}`

### 4. Error Handling
- Inline errors: Red text below form
- Alert dialogs: For success confirmations
- Auto-logout: On 401/403 errors

### 5. Haptic Feedback
- System default for buttons and toggles
- (Simulator shows warnings - normal)

---

## Accessibility

### Text Scaling
- All text uses system fonts
- Supports Dynamic Type
- Minimum touch targets: 44x44pt

### Color Contrast
- Dark text on light backgrounds
- Icon colors with sufficient contrast
- Secondary text uses system `.secondary` color

### VoiceOver
- All interactive elements have labels
- SF Symbols provide automatic labels

---

## Animation & Transitions

### Subtle Animations
- Sheet presentations: System slide-up
- List updates: Automatic fade
- Button presses: System highlight
- No custom animations (keeps it simple and fast)

---

## Responsive Design

### Adaptivity
- Forms: Stack on all screen sizes
- Grids: 2-column for quick actions
- Lists: Single column, full width
- Cards: Fixed width (180pt) in horizontal scroll

### Safe Areas
- All content respects safe areas
- `.ignoresSafeArea()` only for background gradients

---

## Design Principles

### 1. **Consistency**
- Same corner radius (12-16pt) throughout
- Same color palette for similar actions
- Same spacing scale everywhere

### 2. **Clarity**
- Dark text on light backgrounds
- Clear labels and icons
- Obvious touch targets

### 3. **Delight**
- Gradients for visual interest
- Emojis in console logs (developer experience)
- Success confirmations

### 4. **Simplicity**
- Minimal custom components
- System defaults where possible
- Clean, uncluttered layouts

### 5. **Familiarity**
- Standard iOS patterns
- Native controls
- Predictable navigation

---

## File Organization

```
Views/
├── Authentication/
│   ├── WelcomeView.swift      - Gradient background, centered logo
│   ├── LoginView.swift        - Form with dark text inputs
│   └── RegisterView.swift     - Multi-section form
├── Dashboard/
│   └── DashboardView.swift    - Scroll view with multiple sections
├── Dogs/
│   ├── DogsListView.swift     - Standard list with + button
│   ├── AddDogView.swift       - Form in navigation stack
│   └── DogDetailView.swift    - (exists in DogsListView.swift)
├── Activity/
│   ├── ActivityListView.swift - Grouped list by date
│   └── LogActivityView.swift  - Form with dynamic fields
├── HealthView.swift           - Empty state placeholder
└── ProfileView.swift          - Settings list style

Models/
├── User.swift                 - Codable, Identifiable
├── Dog.swift                  - Codable, Identifiable, Hashable
└── Activity.swift             - Codable, Identifiable

Services/
├── APIClient.swift            - Network layer with logging
└── AuthenticationManager.swift - Token management

ViewModels/
├── DashboardViewModel.swift   - @Published properties
├── DogsListViewModel.swift    - CRUD operations
└── ActivityViewModel.swift    - Filtering and grouping
```

---

## Key Features Implemented

✅ **Authentication** - Login/Register with validation
✅ **Dog Management** - Add, list, view dogs
✅ **Activity Tracking** - Log and view activities
✅ **Dashboard** - Quick overview and actions
✅ **Profile** - User info and logout
✅ **Pull-to-Refresh** - All list views
✅ **Empty States** - Friendly prompts
✅ **Error Handling** - Inline and alert-based
✅ **Loading States** - Spinners and progress indicators

---

## Future Enhancements (Not Yet Implemented)

🔲 Health records with dates and attachments
🔲 Photo uploads for dogs and activities
🔲 Feeding schedule and tracking
🔲 Grooming appointments
🔲 Push notifications for reminders
🔲 Dark mode support
🔲 Widget for quick stats
🔲 Charts and graphs for activity trends
🔲 Social features (share activities)
🔲 Offline mode with local database

---

This design system ensures a cohesive, professional iOS app that feels native and is easy to use!
