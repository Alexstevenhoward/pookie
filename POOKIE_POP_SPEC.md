# POOKIE POP - COMPLETE TECHNICAL SPECIFICATION

## 📋 Executive Summary
Pookie Pop is a match-3 puzzle game featuring a cryptocurrency reward system (Pookie Points) integrated into the Pookie app. This is a sub-app accessible via the Dashboard's "Pookie Pop" quick action button.

---

## 🎨 Design Philosophy & Visual Identity

### Core Design Language: Claymorphism
- **Frosted glass effects**: backdrop-filter with blur
- **Soft, puffy 3D surfaces**: Multi-layered shadows
- **Translucent backgrounds**: opacity 0.4-0.8
- **Rounded corners**: 20-40px border-radius
- **High contrast borders**: White/light edges
- **Subtle gradients**: For dimension

### Visual Reference
The game should match the existing Pookie app's claymorphism style:
- Soft shadows (light from top-left, dark from bottom-right)
- Semi-transparent white backgrounds
- Smooth, rounded corners
- Gentle depth effects

---

## 🎬 Animation Specifications (CRITICAL)

### 1. Match Animations (When 3+ items match)

#### A. Pre-Match Highlight (100ms)
```swift
Timeline:
- 0ms: Scale from 1.0 to 1.15
- 50ms: Add bright glow ring
- 100ms: Hold at scale 1.15

Visual Effect:
- Matched items pulse larger simultaneously
- White glow outline
- Bounce effect (cubic-bezier(0.68, -0.55, 0.265, 1.55))
```

#### B. Pop/Burst Animation (200ms)
```swift
Timeline:
- 0ms: Start from scale 1.15
- 50ms: Scale to 1.3 with rotation (15deg)
- 100ms: Scale to 0.8 with opposite rotation (-15deg)
- 150ms: Scale to 0.3, increase opacity to 0
- 200ms: Completely invisible (opacity: 0, scale: 0)

Particle System:
- Spawn 8-12 particles per matched item
- Particles are small emoji copies (0.5x size)
- Radial explosion pattern (360° distribution)
- Each particle travels 60-120px outward
- Particle lifetime: 400ms
- Fade out after 200ms
```

**Sound Effects:**
- 3 match: "pop-soft.mp3" (light, bubbly)
- 4 match: "pop-medium.mp3" (deeper, more resonant)
- 5+ match: "pop-epic.mp3" (triumphant chime)

**Haptic Feedback:**
- 3 match: Light impact (10ms vibration)
- 4 match: Medium impact (25ms vibration)
- 5+ match: Heavy impact (50ms) + Light (10ms) after 100ms delay

#### C. Score Popup Animation (1000ms)
```swift
Timeline:
- 0ms: Spawn at matched item center, opacity 0, scale 0.5
- 100ms: Fade to opacity 1, scale to 1.2
- 300ms: Begin upward movement (translateY: -100px)
- 700ms: Start fade out (opacity: 1 → 0)
- 1000ms: Completely invisible, remove from DOM

Visual Style:
- Font: Bold, 18-24px
- Color based on match size:
  - 3 match: #F59E0B (amber)
  - 4 match: #3B82F6 (blue)
  - 5+ match: #8B5CF6 (purple)
- Text shadow: 0 2px 8px rgba(0,0,0,0.3)
- Background: Semi-transparent pill shape
```

### 2. Falling Animations (Items dropping into empty spaces)

#### A. Existing Items Falling Down
```swift
Physics Model:
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce effect)
- Duration: 400ms per cell dropped
- Distance-based timing: Longer falls feel slightly slower

Visual Effects:
- Slight scale squish on landing (1.0 → 0.95 → 1.05 → 1.0)
- Landing duration: 100ms
- No rotation during fall
- Slight blur effect during motion

Sound Effects:
- Soft "thud" sound when landing
- Volume based on fall distance
- Max 3 simultaneous fall sounds
```

#### B. New Items Spawning from Top
```swift
Spawn Animation:
Timeline:
- 0ms: Start above grid (translateY: -150%)
       Scale: 0.5, Opacity: 0, Rotation: -180deg
- 100ms: Opacity: 1, Scale: 0.8
- 400ms: Land at final position
         Scale sequence: 0.8 → 1.15 → 0.95 → 1.0
         Rotation: -180deg → 0deg

Visual Effects:
- Items "materialize" with spiral effect
- Slight glow during spawn (0-100ms)
- Claymorphic depth appears gradually
- Color saturation: 70% → 100%
```

#### C. Cascade Chain Reactions
```swift
Timing:
- Wait 100ms after fall animations complete
- Check for new matches
- If matches found, repeat match animation sequence
- Each cascade level adds +50ms delay
- Maximum cascade depth: 10 levels

Visual Feedback:
- Combo counter appears on 2+ cascades
- Screen shake on 3+ cascades (2px horizontal, 150ms)
- Gradient background pulse on 4+ cascades
```

---

## 🎮 Game Logic Implementation

### Level Configuration System

```swift
struct LevelConfig {
    let number: Int
    let name: String
    let targetScore: Int
    let moves: Int
    let stars: [Int] // [1-star, 2-star, 3-star thresholds]
    let pookiePoints: [Int] // Points for each star tier
    let difficulty: Difficulty
    let specialMechanics: SpecialMechanics?
}

enum Difficulty {
    case easy, medium, hard, expert, master
}

struct SpecialMechanics {
    let frozenTiles: [Int]? // Grid indices
    let blockedTiles: [Int]? // Grid indices
    let requiredMatches: [RequiredMatch]?
}
```

### 100 Levels Structure
- **Levels 1-10**: Easy (Tutorial phase)
- **Levels 11-25**: Medium
- **Levels 26-50**: Hard
- **Levels 51-75**: Expert
- **Levels 76-100**: Master

**Level Names:**
- Cycle through: "Puppy Park", "Fetch Master", "Good Boy", "Top Dog", "Pack Leader", "Best Friend", "Pookie Pro", "Woof Master", "Legend", "Alpha Dog", "Bone Hunter", "Tail Wagger", "Bark Boss", "Paw Prince", "Sniff King", "Treat Titan", "Howl Hero", "Zoomie Master", "Fetch Overlord", "Pookie Emperor"

### Match Detection Algorithm
```swift
class MatchDetector {
    func findAllMatches(grid: [[GridCell]]) -> [Match] {
        // Find horizontal matches
        // Find vertical matches
        // Merge overlapping matches
        // Return all matches
    }
    
    func wouldCreateMatch(swap: Swap) -> Bool {
        // Check if swap would create valid matches
    }
}
```

### Grid Generation (No Initial Matches)
```swift
class GridGenerator {
    func generateGrid(size: Int, items: [String]) -> [[GridCell]] {
        // Use backtracking to ensure no initial matches
        // Return valid grid
    }
}
```

### Score Calculation System
```swift
struct ScoreConfig {
    let basePointsPerItem: Int = 10
    let match4Bonus: Int = 50
    let match5Bonus: Int = 100
    let match6PlusBonus: Int = 200
    let comboMultipliers: [Double] = [1.0, 1.2, 1.5, 2.0, 2.5]
    let cascadeBonus: Int = 25
}

class ScoreCalculator {
    func calculateMatchScore(matchSize: Int, comboLevel: Int, isCascade: Bool) -> Int
    func calculateStars(score: Int, thresholds: [Int]) -> Int
}
```

---

## 🎨 Dog-Themed Map Plan (10 Sections × 10 Levels)

### 1. Puppy Playground 🛝
- **Theme**: Green grass, dog toys (balls, frisbees, chew ropes)
- **Levels**: Stepping stones shaped like tennis balls
- **Section Marker**: Fire hydrant

### 2. Bone Canyon 🦴
- **Theme**: Rocky desert with giant cartoon bones
- **Levels**: Bone-shaped clay buttons
- **Section Marker**: Bone arch

### 3. Dog Park Lake 🌊
- **Theme**: Water streams, ducks, floating logs
- **Levels**: Lily pads or paw-shaped platforms
- **Section Marker**: Dog dock with life rings

### 4. Backyard BBQ 🍔
- **Theme**: Picnic tables, dog bowls, hamburgers
- **Levels**: Hot dog & burger stepping stones
- **Section Marker**: Big food bowl

### 5. Haunted Dog House 👻
- **Theme**: Spooky kennel, glowing paw prints
- **Levels**: Ghost dog paw platforms
- **Section Marker**: Haunted doghouse

### 6. Winter Walks ❄️
- **Theme**: Snowy hills, scarves, pawprints in snow
- **Levels**: Snow pawpads or snowballs
- **Section Marker**: Sled with a husky

### 7. Beach Fetch 🏖️
- **Theme**: Sand, seashells, palm trees
- **Levels**: Frisbees in sand
- **Section Marker**: Sandcastle with paw flag

### 8. Dog Training School 🎓
- **Theme**: Agility ramps, tunnels, hoops
- **Levels**: Agility course cones
- **Section Marker**: Gold medal with pawprint

### 9. City Stroll 🌆
- **Theme**: Sidewalks, fire hydrants, lamp posts
- **Levels**: Paw print on sidewalk tiles
- **Section Marker**: Subway station with paw graffiti

### 10. Royal Dog Castle 👑
- **Theme**: Throne, red carpet, golden bowls
- **Levels**: Crown-shaped platforms
- **Section Marker**: Huge royal bone gate

---

## 🎨 Claymorphism UI Component Library

### Base Shadow System (SwiftUI)
```swift
struct ClayStyle {
    static let primary = {
        // Background
        .background(Color.white.opacity(0.6))
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.white.opacity(0.5), lineWidth: 2)
        )
        .shadow(color: Color.white.opacity(0.8), radius: 8, x: -4, y: -4)
        .shadow(color: Color.black.opacity(0.15), radius: 8, x: 4, y: 4)
    }
    
    static let tile = {
        .background(Color.white.opacity(0.7))
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.white.opacity(0.6), lineWidth: 3)
        )
        .shadow(color: Color.white.opacity(0.8), radius: 6, x: -3, y: -3)
        .shadow(color: Color.black.opacity(0.15), radius: 6, x: 3, y: 3)
    }
    
    static let button = {
        .background(Color.white.opacity(0.8))
        .cornerRadius(28)
        .overlay(
            RoundedRectangle(cornerRadius: 28)
                .stroke(Color.white.opacity(0.7), lineWidth: 2)
        )
        .shadow(color: Color.white.opacity(0.8), radius: 10, x: -4, y: -4)
        .shadow(color: Color.black.opacity(0.15), radius: 10, x: 4, y: 4)
    }
}
```

### Color Gradients
```swift
enum ClayGradients {
    static let primary = LinearGradient(
        colors: [Color(red: 0.58, green: 0.77, blue: 0.99, opacity: 0.7),
                 Color(red: 0.38, green: 0.65, blue: 0.98, opacity: 0.6)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let success = LinearGradient(
        colors: [Color(red: 0.53, green: 0.94, blue: 0.67, opacity: 0.7),
                 Color(red: 0.29, green: 0.87, blue: 0.50, opacity: 0.6)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let warning = LinearGradient(
        colors: [Color(red: 0.99, green: 0.88, blue: 0.28, opacity: 0.7),
                 Color(red: 0.98, green: 0.80, blue: 0.08, opacity: 0.6)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
```

---

## 📁 Project Structure

```
PookieBear/
├── Views/
│   └── PookiePop/
│       ├── PookiePopView.swift              # Main game container
│       ├── Components/
│       │   ├── Game/
│       │   │   ├── GameBoardView.swift      # 8x8 grid
│       │   │   ├── GameTileView.swift       # Individual tile
│       │   │   ├── MatchAnimationView.swift # Match effects
│       │   │   ├── FallingAnimationView.swift # Falling effects
│       │   │   ├── ParticleSystemView.swift # Particle effects
│       │   │   └── ScorePopupView.swift     # Score display
│       │   ├── Map/
│       │   │   ├── LevelMapView.swift       # Scrollable map
│       │   │   ├── LevelNodeView.swift      # Individual level button
│       │   │   └── MapSectionView.swift     # Themed sections
│       │   └── UI/
│       │       ├── ClayButton.swift         # Reusable button
│       │       ├── ClayCard.swift           # Card component
│       │       ├── ClayModal.swift          # Modal dialogs
│       │       ├── ProgressBar.swift        # Progress indicator
│       │       └── StarRating.swift         # Star display
│       ├── Screens/
│       │   ├── MenuScreen.swift             # Main menu
│       │   ├── GameScreen.swift             # Active gameplay
│       │   ├── LevelCompleteScreen.swift    # Victory screen
│       │   └── LevelFailScreen.swift        # Failure screen
│       ├── Models/
│       │   ├── GameState.swift              # Game state management
│       │   ├── LevelConfig.swift            # Level definitions
│       │   ├── GridCell.swift               # Cell model
│       │   └── Match.swift                  # Match model
│       ├── ViewModels/
│       │   ├── PookiePopViewModel.swift     # Main game logic
│       │   ├── GameBoardViewModel.swift     # Board logic
│       │   └── LevelMapViewModel.swift      # Map logic
│       ├── Services/
│       │   ├── MatchDetectionService.swift  # Match algorithm
│       │   ├── GridGenerationService.swift  # Grid creation
│       │   ├── ScoreCalculationService.swift # Score logic
│       │   ├── SoundManager.swift           # Audio management
│       │   └── HapticManager.swift          # Haptic feedback
│       └── Config/
│           ├── Levels.swift                 # 100 level configs
│           ├── GameConfig.swift             # Game constants
│           └── PookiePopTheme.swift         # Theme colors
```

---

## 🎯 Core Features

### 1. Game Mechanics
- ✅ 8×8 grid match-3 gameplay
- ✅ Swap adjacent tiles to create matches
- ✅ Minimum 3 items in a row/column
- ✅ Gravity system (tiles fall down)
- ✅ New tiles spawn from top
- ✅ Cascade chain reactions
- ✅ Combo multiplier system
- ✅ Move limit per level
- ✅ Score targets for 1-3 stars

### 2. Progression System
- ✅ 100 unique levels
- ✅ 10 themed sections (10 levels each)
- ✅ Progressive difficulty scaling
- ✅ Level unlocking (sequential)
- ✅ Star collection (3 per level)
- ✅ Pookie Points rewards

### 3. Lives System
- ✅ 5 maximum lives
- ✅ 1 life lost per failed level
- ✅ 1 life regenerates every 30 minutes
- ✅ Purchase lives with Pookie Points
- ✅ Watch ads for free lives

### 4. Pookie Points Integration
- ✅ Earn points for completing levels
- ✅ Bonus points for 3-star completion
- ✅ 600 points = 1 free Pro month ($5.99 value)
- ✅ Spend points on power-ups
- ✅ Spend points on lives

### 5. Power-Ups
- **Hammer**: Remove any single tile
- **Shuffle**: Rearrange entire board
- **Extra Moves**: Add +5 moves to current level

### 6. UI/UX Features
- ✅ Claymorphism design throughout
- ✅ Smooth 60fps animations
- ✅ Haptic feedback on all interactions
- ✅ Sound effects for all actions
- ✅ Background music
- ✅ Settings modal (sound/music/haptic toggles)
- ✅ Pause functionality
- ✅ Level map with themed sections

---

## 🎵 Audio System

### Sound Effects Required
```
Sounds/PookiePop/
├── pop-soft.mp3          # 3 match
├── pop-medium.mp3        # 4 match
├── pop-epic.mp3          # 5+ match
├── swap.mp3              # Valid swap
├── invalid.mp3           # Invalid move
├── victory.mp3           # Level complete
├── fail.mp3              # Level failed
├── button.mp3            # UI button tap
├── powerup.mp3           # Power-up activation
├── reward.mp3            # Points earned
├── combo-2.mp3           # 2x combo
├── combo-3.mp3           # 3x combo
├── combo-epic.mp3        # 4x+ combo
└── background-music.mp3  # Looping background
```

### Sound Manager
```swift
class SoundManager {
    static let shared = SoundManager()
    
    func play(_ sound: GameSound, volume: Float = 1.0)
    func playMusic(_ track: MusicTrack, loop: Bool = true)
    func stopMusic()
    func setMusicVolume(_ volume: Float)
    func setSoundVolume(_ volume: Float)
    func setEnabled(_ enabled: Bool)
}

enum GameSound {
    case match3, match4, match5Plus
    case swap, invalid
    case victory, fail
    case button, powerup, reward
    case combo2, combo3, comboEpic
}
```

---

## 📳 Haptic Feedback System

```swift
class HapticManager {
    static let shared = HapticManager()
    
    func trigger(_ pattern: HapticPattern)
    func onMatch(matchSize: Int)
    func onCombo(comboLevel: Int)
    func setEnabled(_ enabled: Bool)
}

enum HapticPattern {
    case light, medium, heavy
    case success, warning, error
    case selection
}
```

---

## 🚀 Implementation Phases

### Phase 1: Core Game Logic (Week 1)
- [ ] Grid generation algorithm
- [ ] Match detection algorithm
- [ ] Score calculation system
- [ ] Level configuration system
- [ ] Basic game state management

### Phase 2: UI Foundation (Week 1-2)
- [ ] Claymorphism component library
- [ ] Game board layout
- [ ] Tile rendering
- [ ] Basic navigation
- [ ] Settings modal

### Phase 3: Animations (Week 2-3)
- [ ] Match animations
- [ ] Falling animations
- [ ] Particle system
- [ ] Score popups
- [ ] Combo effects

### Phase 4: Game Features (Week 3-4)
- [ ] Lives system
- [ ] Power-ups
- [ ] Level map
- [ ] Victory/failure screens
- [ ] Pookie Points integration

### Phase 5: Audio & Polish (Week 4-5)
- [ ] Sound effects integration
- [ ] Background music
- [ ] Haptic feedback
- [ ] Performance optimization
- [ ] Bug fixes

### Phase 6: Content (Week 5-6)
- [ ] 100 level configurations
- [ ] 10 themed map sections
- [ ] Level testing & balancing
- [ ] Final polish

---

## 🎮 Game Items (Match-3 Tiles)

Use dog-themed emojis:
- 🐕 Dog face
- 🦴 Bone
- 🎾 Tennis ball
- 🐾 Paw print
- 🦮 Service dog
- 🎀 Bow/collar

---

## 📊 Analytics Events

```swift
enum PookiePopEvent {
    case levelStart(levelNumber: Int)
    case levelComplete(levelNumber: Int, stars: Int, score: Int)
    case levelFail(levelNumber: Int, score: Int)
    case matchMade(size: Int)
    case comboAchieved(level: Int)
    case powerUpUsed(type: PowerUpType)
    case pookiePointsEarned(amount: Int)
    case livesUsed
    case livesPurchased
}
```

---

## 🔒 Anti-Cheat Measures

- Server-side score validation
- Move sequence logging
- Time-based validation
- Client version checking
- Suspicious pattern detection

---

## ✅ Success Criteria

The game must feel as polished as Candy Crush Saga:
- ✅ Buttery smooth 60fps animations
- ✅ Satisfying haptic feedback on every action
- ✅ Juicy particle effects
- ✅ Professional sound design
- ✅ Beautiful claymorphism UI
- ✅ Addictive gameplay loop
- ✅ No performance issues

---

## 📝 Notes

- This is a **sub-app** within the main Pookie app
- Accessed via Dashboard "Pookie Pop" quick action button
- Must maintain consistent claymorphism design with main app
- Pookie Points integrate with existing cryptocurrency system
- Lives system is independent from main app features
- All animations must be smooth and performant on iOS devices
