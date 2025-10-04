# POOKIE POP - IMPLEMENTATION TASK BREAKDOWN

## 📋 Overview
This document breaks down the Pookie Pop implementation into manageable, sequential tasks. Each task is designed to be completed independently while building upon previous work.

---

## 🎯 PHASE 1: Foundation & Setup (Days 1-2)

### Task 1.1: Project Structure Setup
**Estimated Time**: 2 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Create `/Views/PookiePop/` directory structure
- [ ] Create all subdirectories (Components, Screens, Models, ViewModels, Services, Config)
- [ ] Create placeholder files for main components
- [ ] Add PookiePop to navigation system

**Files to Create:**
```
Views/PookiePop/
├── PookiePopView.swift
├── Components/Game/
├── Components/Map/
├── Components/UI/
├── Screens/
├── Models/
├── ViewModels/
├── Services/
└── Config/
```

**Acceptance Criteria:**
- ✅ All directories created
- ✅ Can navigate to PookiePop from Dashboard
- ✅ Basic view displays

---

### Task 1.2: Core Data Models
**Estimated Time**: 3 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Create `GridCell` model
- [ ] Create `Match` model
- [ ] Create `LevelConfig` model
- [ ] Create `GameState` model
- [ ] Create `PowerUp` enum

**Files to Create:**
```swift
// Models/GridCell.swift
struct GridCell: Identifiable, Equatable {
    let id: UUID
    let type: TileType
    var row: Int
    var col: Int
    var isMatched: Bool
    var isFalling: Bool
}

enum TileType: String, CaseIterable {
    case dog = "🐕"
    case bone = "🦴"
    case ball = "🎾"
    case paw = "🐾"
    case serviceDog = "🦮"
    case bow = "🎀"
}

// Models/Match.swift
struct Match {
    let cells: [(row: Int, col: Int)]
    let type: MatchType
    let size: Int
}

enum MatchType {
    case horizontal
    case vertical
}

// Models/LevelConfig.swift
struct LevelConfig {
    let number: Int
    let name: String
    let targetScore: Int
    let moves: Int
    let stars: [Int]
    let pookiePoints: [Int]
    let difficulty: Difficulty
}

enum Difficulty {
    case easy, medium, hard, expert, master
}

// Models/GameState.swift
class GameState: ObservableObject {
    @Published var grid: [[GridCell]]
    @Published var score: Int
    @Published var movesRemaining: Int
    @Published var currentLevel: Int
    @Published var lives: Int
    @Published var pookiePoints: Int
}
```

**Acceptance Criteria:**
- ✅ All models compile without errors
- ✅ Models are well-documented
- ✅ Enums have all required cases

---

### Task 1.3: Claymorphism UI Components
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create `ClayButton` component
- [ ] Create `ClayCard` component
- [ ] Create `ClayModal` component
- [ ] Create `ProgressBar` component
- [ ] Create `StarRating` component
- [ ] Create `PookiePopTheme` configuration

**Files to Create:**
```swift
// Components/UI/ClayButton.swift
// Components/UI/ClayCard.swift
// Components/UI/ClayModal.swift
// Components/UI/ProgressBar.swift
// Components/UI/StarRating.swift
// Config/PookiePopTheme.swift
```

**Acceptance Criteria:**
- ✅ All components match existing app's claymorphism style
- ✅ Components are reusable
- ✅ Proper shadow layering
- ✅ Preview providers for each component

---

## 🎮 PHASE 2: Core Game Logic (Days 3-4)

### Task 2.1: Grid Generation Service
**Estimated Time**: 4 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Implement grid generation algorithm
- [ ] Ensure no initial matches
- [ ] Add validation logic
- [ ] Write unit tests

**File to Create:**
```swift
// Services/GridGenerationService.swift
class GridGenerationService {
    func generateGrid(size: Int, tileTypes: [TileType]) -> [[GridCell]]
    private func wouldCreateMatch(grid: [[GridCell]], row: Int, col: Int, type: TileType) -> Bool
    private func generateCell(grid: [[GridCell]], row: Int, col: Int) -> GridCell
}
```

**Algorithm:**
1. Create empty 8×8 grid
2. For each cell (left to right, top to bottom):
   - Try random tile type
   - Check if it would create a match with previous cells
   - If yes, try different type
   - If no valid type after 50 attempts, use fallback
3. Return completed grid

**Acceptance Criteria:**
- ✅ Generates 8×8 grid
- ✅ No initial matches exist
- ✅ All cells are valid
- ✅ Unit tests pass

---

### Task 2.2: Match Detection Service
**Estimated Time**: 5 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Implement horizontal match detection
- [ ] Implement vertical match detection
- [ ] Implement match merging logic
- [ ] Add swap validation
- [ ] Write unit tests

**File to Create:**
```swift
// Services/MatchDetectionService.swift
class MatchDetectionService {
    func findAllMatches(grid: [[GridCell]]) -> [Match]
    func findHorizontalMatches(grid: [[GridCell]]) -> [Match]
    func findVerticalMatches(grid: [[GridCell]]) -> [Match]
    func wouldCreateMatch(grid: [[GridCell]], swap: Swap) -> Bool
    private func mergeOverlappingMatches(matches: [Match]) -> [Match]
}

struct Swap {
    let from: (row: Int, col: Int)
    let to: (row: Int, col: Int)
}
```

**Algorithm:**
1. Scan each row for 3+ consecutive matching tiles
2. Scan each column for 3+ consecutive matching tiles
3. Merge overlapping matches
4. Return all unique matches

**Acceptance Criteria:**
- ✅ Detects all horizontal matches
- ✅ Detects all vertical matches
- ✅ Handles edge cases (corners, edges)
- ✅ Unit tests pass with 100% coverage

---

### Task 2.3: Score Calculation Service
**Estimated Time**: 3 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Implement base score calculation
- [ ] Add combo multipliers
- [ ] Add cascade bonuses
- [ ] Implement star rating logic
- [ ] Write unit tests

**File to Create:**
```swift
// Services/ScoreCalculationService.swift
class ScoreCalculationService {
    let config: ScoreConfig
    
    func calculateMatchScore(matchSize: Int, comboLevel: Int, isCascade: Bool) -> Int
    func calculateTotalScore(matches: [Match], comboLevel: Int) -> Int
    func calculateStars(score: Int, thresholds: [Int]) -> Int
}

struct ScoreConfig {
    let basePointsPerItem: Int = 10
    let match4Bonus: Int = 50
    let match5Bonus: Int = 100
    let match6PlusBonus: Int = 200
    let comboMultipliers: [Double] = [1.0, 1.2, 1.5, 2.0, 2.5]
    let cascadeBonus: Int = 25
}
```

**Acceptance Criteria:**
- ✅ Correct score for all match sizes
- ✅ Combo multipliers apply correctly
- ✅ Star thresholds work properly
- ✅ Unit tests pass

---

### Task 2.4: Game Board ViewModel
**Estimated Time**: 6 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Implement game state management
- [ ] Add swap handling
- [ ] Add match processing
- [ ] Add gravity/falling logic
- [ ] Add cascade detection
- [ ] Integrate all services

**File to Create:**
```swift
// ViewModels/GameBoardViewModel.swift
class GameBoardViewModel: ObservableObject {
    @Published var grid: [[GridCell]]
    @Published var score: Int = 0
    @Published var movesRemaining: Int
    @Published var isProcessing: Bool = false
    @Published var matches: [Match] = []
    @Published var comboLevel: Int = 0
    
    private let matchService: MatchDetectionService
    private let scoreService: ScoreCalculationService
    private let gridService: GridGenerationService
    
    func startLevel(_ config: LevelConfig)
    func swapTiles(from: (Int, Int), to: (Int, Int))
    func processMatches()
    func applyGravity()
    func spawnNewTiles()
    func checkForCascades()
}
```

**Acceptance Criteria:**
- ✅ Can swap tiles
- ✅ Detects matches after swap
- ✅ Applies gravity correctly
- ✅ Spawns new tiles
- ✅ Handles cascades
- ✅ Updates score

---

## 🎨 PHASE 3: UI & Rendering (Days 5-6)

### Task 3.1: Game Board View
**Estimated Time**: 5 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Create 8×8 grid layout
- [ ] Implement tile rendering
- [ ] Add tap gesture handling
- [ ] Add swap gesture handling
- [ ] Connect to ViewModel

**File to Create:**
```swift
// Components/Game/GameBoardView.swift
struct GameBoardView: View {
    @ObservedObject var viewModel: GameBoardViewModel
    @State private var selectedTile: (row: Int, col: Int)?
    
    var body: some View {
        // 8×8 grid with tiles
    }
    
    private func handleTileTap(row: Int, col: Int)
    private func attemptSwap(from: (Int, Int), to: (Int, Int))
}
```

**Acceptance Criteria:**
- ✅ Grid displays correctly
- ✅ Tiles are properly sized
- ✅ Can select tiles
- ✅ Can swap adjacent tiles
- ✅ Invalid swaps are rejected

---

### Task 3.2: Game Tile View
**Estimated Time**: 3 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create tile component
- [ ] Apply claymorphism styling
- [ ] Add selection state
- [ ] Add matched state
- [ ] Add falling state

**File to Create:**
```swift
// Components/Game/GameTileView.swift
struct GameTileView: View {
    let cell: GridCell
    let isSelected: Bool
    let isMatched: Bool
    
    var body: some View {
        Text(cell.type.rawValue)
            .font(.system(size: 40))
            .frame(width: 60, height: 60)
            .background(tileBackground)
            .scaleEffect(isSelected ? 1.1 : 1.0)
            .opacity(isMatched ? 0.5 : 1.0)
    }
    
    private var tileBackground: some View {
        // Claymorphism styling
    }
}
```

**Acceptance Criteria:**
- ✅ Tile displays emoji correctly
- ✅ Claymorphism styling applied
- ✅ Selection state visible
- ✅ Matched state visible

---

### Task 3.3: Game Screen
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create game screen layout
- [ ] Add score display
- [ ] Add moves counter
- [ ] Add progress bar
- [ ] Add pause button
- [ ] Add power-up buttons

**File to Create:**
```swift
// Screens/GameScreen.swift
struct GameScreen: View {
    @StateObject private var viewModel: GameBoardViewModel
    let levelConfig: LevelConfig
    
    var body: some View {
        VStack {
            // Header (score, moves, pause)
            // Game board
            // Power-ups
        }
    }
}
```

**Acceptance Criteria:**
- ✅ All UI elements display correctly
- ✅ Score updates in real-time
- ✅ Moves counter decrements
- ✅ Progress bar shows level progress

---

## 🎬 PHASE 4: Animations (Days 7-9)

### Task 4.1: Match Animation
**Estimated Time**: 6 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Implement highlight phase (100ms)
- [ ] Implement pop phase (200ms)
- [ ] Add rotation effects
- [ ] Add scale effects
- [ ] Add opacity fade
- [ ] Integrate sound effects
- [ ] Integrate haptic feedback

**File to Create:**
```swift
// Components/Game/MatchAnimationView.swift
struct MatchAnimationView: View {
    let cells: [(row: Int, col: Int)]
    let matchSize: Int
    let onComplete: () -> Void
    
    @State private var highlightScale: CGFloat = 1.0
    @State private var popScale: CGFloat = 1.0
    @State private var rotation: Double = 0
    @State private var opacity: Double = 1.0
    
    var body: some View {
        // Animation overlay
    }
    
    private func startAnimation()
}
```

**Animation Sequence:**
1. **Highlight (100ms)**:
   - Scale: 1.0 → 1.15
   - Add glow effect
   
2. **Pop (200ms)**:
   - Scale: 1.15 → 1.3 → 0.8 → 0.3 → 0
   - Rotate: 0° → 15° → -15° → 0°
   - Opacity: 1.0 → 0

**Acceptance Criteria:**
- ✅ Animation timing is exact
- ✅ Smooth 60fps performance
- ✅ Sound plays correctly
- ✅ Haptic triggers correctly

---

### Task 4.2: Falling Animation
**Estimated Time**: 6 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Implement existing tile falling
- [ ] Implement new tile spawning
- [ ] Add bounce effect on landing
- [ ] Add blur during motion
- [ ] Integrate sound effects

**File to Create:**
```swift
// Components/Game/FallingAnimationView.swift
struct FallingAnimationView: View {
    let cell: GridCell
    let fromRow: Int
    let toRow: Int
    let isNewSpawn: Bool
    let onComplete: () -> Void
    
    @State private var position: CGFloat
    @State private var scale: CGFloat
    @State private var rotation: Double
    @State private var opacity: Double
    
    var body: some View {
        // Falling tile
    }
}
```

**Animation Sequence:**

**Existing Tiles (400ms)**:
- Fall with bounce easing
- Squish on landing: 1.0 → 0.95 → 1.05 → 1.0
- Slight blur during motion

**New Tiles (500ms)**:
- Start above grid (translateY: -150%)
- Spiral effect: rotate -180° → 0°
- Scale: 0.5 → 1.0
- Opacity: 0 → 1

**Acceptance Criteria:**
- ✅ Smooth falling motion
- ✅ Bounce effect on landing
- ✅ New tiles materialize correctly
- ✅ No performance issues

---

### Task 4.3: Particle System
**Estimated Time**: 5 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create particle view
- [ ] Implement radial explosion
- [ ] Add fade out effect
- [ ] Optimize for performance

**File to Create:**
```swift
// Components/Game/ParticleSystemView.swift
struct ParticleSystemView: View {
    let origin: CGPoint
    let emoji: String
    let count: Int
    
    var body: some View {
        ForEach(0..<count, id: \.self) { index in
            ParticleView(
                emoji: emoji,
                angle: (Double(index) / Double(count)) * 2 * .pi,
                origin: origin
            )
        }
    }
}

struct ParticleView: View {
    let emoji: String
    let angle: Double
    let origin: CGPoint
    
    @State private var offset: CGSize = .zero
    @State private var scale: CGFloat = 1.0
    @State private var opacity: Double = 1.0
    
    var body: some View {
        Text(emoji)
            .font(.system(size: 20))
            .scaleEffect(scale)
            .opacity(opacity)
            .offset(offset)
    }
}
```

**Particle Behavior:**
- Spawn 8-12 particles per match
- Radial explosion (360° distribution)
- Travel 60-120px outward
- Lifetime: 400ms
- Fade out after 200ms

**Acceptance Criteria:**
- ✅ Particles spawn correctly
- ✅ Radial distribution is even
- ✅ Smooth animation
- ✅ No memory leaks

---

### Task 4.4: Score Popup Animation
**Estimated Time**: 3 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create score popup view
- [ ] Implement float-up animation
- [ ] Add color coding by match size
- [ ] Add fade out effect

**File to Create:**
```swift
// Components/Game/ScorePopupView.swift
struct ScorePopupView: View {
    let points: Int
    let matchSize: Int
    let position: CGPoint
    
    @State private var offset: CGFloat = 0
    @State private var scale: CGFloat = 0.5
    @State private var opacity: Double = 0
    
    var body: some View {
        Text("+\(points)")
            .font(.system(size: 20, weight: .bold))
            .foregroundColor(colorForMatchSize)
            .scaleEffect(scale)
            .opacity(opacity)
            .offset(y: offset)
    }
    
    private var colorForMatchSize: Color {
        switch matchSize {
        case 3: return Color(red: 0.96, green: 0.62, blue: 0.04)
        case 4: return Color(red: 0.23, green: 0.51, blue: 0.96)
        default: return Color(red: 0.55, green: 0.36, blue: 0.96)
        }
    }
}
```

**Animation Sequence (1000ms)**:
- 0ms: opacity 0, scale 0.5
- 100ms: opacity 1, scale 1.2
- 300ms: start moving up (-100px)
- 700ms: start fade out
- 1000ms: remove from view

**Acceptance Criteria:**
- ✅ Smooth float-up animation
- ✅ Correct color coding
- ✅ Proper timing
- ✅ Cleans up after animation

---

## 🗺️ PHASE 5: Level System (Days 10-11)

### Task 5.1: Level Configuration
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create level generation function
- [ ] Generate 100 level configs
- [ ] Balance difficulty progression
- [ ] Add special mechanics for later levels

**File to Create:**
```swift
// Config/Levels.swift
func generateLevels() -> [LevelConfig] {
    var levels: [LevelConfig] = []
    
    for i in 0..<100 {
        let difficulty = determineDifficulty(levelNumber: i + 1)
        let baseScore = 300 + (i * 300)
        let moves = max(9, 30 - (i / 5))
        
        levels.append(LevelConfig(
            number: i + 1,
            name: generateLevelName(i + 1),
            targetScore: baseScore,
            moves: moves,
            stars: [baseScore, Int(Double(baseScore) * 1.5), baseScore * 2],
            pookiePoints: (i + 1) % 10 == 0 ? [10, 15, 25] : [5, 8, 12],
            difficulty: difficulty
        ))
    }
    
    return levels
}

let allLevels = generateLevels()
```

**Level Names (Cycle through 20):**
1. Puppy Park
2. Fetch Master
3. Good Boy
4. Top Dog
5. Pack Leader
6. Best Friend
7. Pookie Pro
8. Woof Master
9. Legend
10. Alpha Dog
11. Bone Hunter
12. Tail Wagger
13. Bark Boss
14. Paw Prince
15. Sniff King
16. Treat Titan
17. Howl Hero
18. Zoomie Master
19. Fetch Overlord
20. Pookie Emperor

**Acceptance Criteria:**
- ✅ 100 levels generated
- ✅ Difficulty scales properly
- ✅ Score thresholds are balanced
- ✅ Pookie Points rewards are appropriate

---

### Task 5.2: Level Map View
**Estimated Time**: 6 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create scrollable map layout
- [ ] Create level node component
- [ ] Add winding path between levels
- [ ] Add section markers (every 10 levels)
- [ ] Implement level unlocking logic

**Files to Create:**
```swift
// Components/Map/LevelMapView.swift
struct LevelMapView: View {
    @ObservedObject var viewModel: LevelMapViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                ForEach(0..<10) { section in
                    MapSectionView(
                        section: section,
                        levels: viewModel.getLevels(for: section),
                        onLevelTap: viewModel.startLevel
                    )
                }
            }
        }
    }
}

// Components/Map/LevelNodeView.swift
struct LevelNodeView: View {
    let level: LevelConfig
    let isUnlocked: Bool
    let stars: Int
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack {
                // Level number
                // Star rating
                // Lock icon if locked
            }
        }
        .disabled(!isUnlocked)
    }
}

// Components/Map/MapSectionView.swift
struct MapSectionView: View {
    let section: Int
    let levels: [LevelConfig]
    let onLevelTap: (Int) -> Void
    
    var body: some View {
        VStack {
            // Section header
            // Winding path with level nodes
            // Section marker
        }
    }
}
```

**Map Sections (10 themed sections):**
1. Puppy Playground 🛝
2. Bone Canyon 🦴
3. Dog Park Lake 🌊
4. Backyard BBQ 🍔
5. Haunted Dog House 👻
6. Winter Walks ❄️
7. Beach Fetch 🏖️
8. Dog Training School 🎓
9. City Stroll 🌆
10. Royal Dog Castle 👑

**Acceptance Criteria:**
- ✅ Map scrolls smoothly
- ✅ Levels display in winding path
- ✅ Locked levels are grayed out
- ✅ Stars display correctly
- ✅ Section themes are visible

---

### Task 5.3: Level Complete Screen
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create victory screen
- [ ] Add star animation
- [ ] Display score and Pookie Points earned
- [ ] Add "Next Level" button
- [ ] Add "Replay" button

**File to Create:**
```swift
// Screens/LevelCompleteScreen.swift
struct LevelCompleteScreen: View {
    let levelNumber: Int
    let score: Int
    let stars: Int
    let pookiePointsEarned: Int
    let onNextLevel: () -> Void
    let onReplay: () -> Void
    let onBackToMap: () -> Void
    
    var body: some View {
        ClayModal {
            VStack(spacing: 20) {
                Text("Level Complete!")
                    .font(.system(size: 32, weight: .bold))
                
                StarRating(stars: stars, animated: true)
                
                Text("Score: \(score)")
                Text("Pookie Points: +\(pookiePointsEarned)")
                
                HStack {
                    ClayButton("Replay", action: onReplay)
                    ClayButton("Next Level", action: onNextLevel)
                }
                
                ClayButton("Back to Map", action: onBackToMap)
            }
        }
    }
}
```

**Acceptance Criteria:**
- ✅ Displays correct information
- ✅ Stars animate in
- ✅ Buttons work correctly
- ✅ Matches claymorphism style

---

### Task 5.4: Level Fail Screen
**Estimated Time**: 3 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create failure screen
- [ ] Display score achieved
- [ ] Show moves/score needed
- [ ] Add "Retry" button
- [ ] Add "Back to Map" button

**File to Create:**
```swift
// Screens/LevelFailScreen.swift
struct LevelFailScreen: View {
    let levelNumber: Int
    let score: Int
    let targetScore: Int
    let onRetry: () -> Void
    let onBackToMap: () -> Void
    
    var body: some View {
        ClayModal {
            VStack(spacing: 20) {
                Text("Out of Moves!")
                    .font(.system(size: 28, weight: .bold))
                
                Text("Score: \(score) / \(targetScore)")
                
                ClayButton("Retry", action: onRetry)
                ClayButton("Back to Map", action: onBackToMap)
            }
        }
    }
}
```

**Acceptance Criteria:**
- ✅ Displays correct information
- ✅ Buttons work correctly
- ✅ Matches claymorphism style

---

## 🎵 PHASE 6: Audio & Haptics (Days 12-13)

### Task 6.1: Sound Manager
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create sound manager singleton
- [ ] Add sound loading logic
- [ ] Implement play/stop methods
- [ ] Add volume controls
- [ ] Add enable/disable toggle

**File to Create:**
```swift
// Services/SoundManager.swift
class SoundManager {
    static let shared = SoundManager()
    
    private var sounds: [GameSound: AVAudioPlayer] = [:]
    private var isEnabled: Bool = true
    private var volume: Float = 1.0
    
    func loadSounds()
    func play(_ sound: GameSound, volume: Float = 1.0)
    func stopAll()
    func setVolume(_ volume: Float)
    func setEnabled(_ enabled: Bool)
}

enum GameSound: String {
    case match3 = "pop-soft"
    case match4 = "pop-medium"
    case match5Plus = "pop-epic"
    case swap = "swap"
    case invalid = "invalid"
    case victory = "victory"
    case fail = "fail"
    case button = "button"
    case powerup = "powerup"
    case reward = "reward"
    case combo2 = "combo-2"
    case combo3 = "combo-3"
    case comboEpic = "combo-epic"
}
```

**Sound Files Needed:**
```
Assets/Sounds/PookiePop/
├── pop-soft.mp3
├── pop-medium.mp3
├── pop-epic.mp3
├── swap.mp3
├── invalid.mp3
├── victory.mp3
├── fail.mp3
├── button.mp3
├── powerup.mp3
├── reward.mp3
├── combo-2.mp3
├── combo-3.mp3
└── combo-epic.mp3
```

**Acceptance Criteria:**
- ✅ All sounds load correctly
- ✅ Sounds play without lag
- ✅ Volume controls work
- ✅ Enable/disable works
- ✅ No memory leaks

---

### Task 6.2: Haptic Manager
**Estimated Time**: 2 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create haptic manager singleton
- [ ] Implement pattern triggers
- [ ] Add match-specific haptics
- [ ] Add combo haptics
- [ ] Add enable/disable toggle

**File to Create:**
```swift
// Services/HapticManager.swift
import UIKit

class HapticManager {
    static let shared = HapticManager()
    
    private var isEnabled: Bool = true
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    
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

**Haptic Patterns:**
- **3 match**: Light impact (10ms)
- **4 match**: Medium impact (25ms)
- **5+ match**: Heavy impact (50ms) + Light (10ms) after 100ms
- **Combo 2**: Light, pause, light
- **Combo 3**: Light, pause, light, pause, light
- **Combo 4+**: Heavy, pause, heavy, pause, heavy

**Acceptance Criteria:**
- ✅ Haptics trigger correctly
- ✅ Timing is accurate
- ✅ Enable/disable works
- ✅ No performance impact

---

### Task 6.3: Audio Integration
**Estimated Time**: 3 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Integrate sounds into match animations
- [ ] Integrate sounds into UI interactions
- [ ] Add background music
- [ ] Test all sound triggers

**Integration Points:**
- Match animations → match sounds
- Swap gestures → swap sound
- Invalid moves → invalid sound
- Button taps → button sound
- Level complete → victory sound
- Level fail → fail sound
- Power-up use → powerup sound
- Combo → combo sounds

**Acceptance Criteria:**
- ✅ All sounds play at correct times
- ✅ No sound overlapping issues
- ✅ Background music loops correctly
- ✅ Volume levels are balanced

---

## 💎 PHASE 7: Features & Polish (Days 14-16)

### Task 7.1: Lives System
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Create lives state management
- [ ] Implement life regeneration timer
- [ ] Add life purchase with Pookie Points
- [ ] Add lives display in UI
- [ ] Add "Out of Lives" modal

**Files to Update:**
```swift
// Models/GameState.swift
class GameState: ObservableObject {
    @Published var lives: Int = 5
    @Published var lastLifeLost: Date?
    
    func loseLife()
    func regenerateLife()
    func purchaseLives(count: Int)
    func timeUntilNextLife() -> TimeInterval
}

// Components/UI/LivesDisplay.swift
struct LivesDisplay: View {
    @ObservedObject var gameState: GameState
    
    var body: some View {
        HStack {
            ForEach(0..<5) { index in
                Image(systemName: index < gameState.lives ? "heart.fill" : "heart")
                    .foregroundColor(.red)
            }
            
            if gameState.lives < 5 {
                Text(timeString(gameState.timeUntilNextLife()))
                    .font(.caption)
            }
        }
    }
}
```

**Lives Rules:**
- Maximum 5 lives
- 1 life lost per failed level
- 1 life regenerates every 30 minutes
- Can purchase 5 lives for 50 Pookie Points

**Acceptance Criteria:**
- ✅ Lives decrement on failure
- ✅ Lives regenerate correctly
- ✅ Timer displays accurately
- ✅ Purchase system works

---

### Task 7.2: Power-Ups System
**Estimated Time**: 5 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create power-up models
- [ ] Implement hammer power-up
- [ ] Implement shuffle power-up
- [ ] Implement extra moves power-up
- [ ] Add power-up UI
- [ ] Add purchase system

**Files to Create:**
```swift
// Models/PowerUp.swift
enum PowerUpType {
    case hammer    // Remove any single tile
    case shuffle   // Rearrange entire board
    case extraMoves // Add +5 moves
}

struct PowerUp {
    let type: PowerUpType
    let cost: Int // Pookie Points
    var count: Int
}

// Components/Game/PowerUpButton.swift
struct PowerUpButton: View {
    let powerUp: PowerUp
    let onUse: () -> Void
    
    var body: some View {
        ClayButton {
            VStack {
                Image(systemName: powerUp.icon)
                Text("\(powerUp.count)")
            }
        } action: {
            onUse()
        }
        .disabled(powerUp.count == 0)
    }
}
```

**Power-Up Costs:**
- Hammer: 20 Pookie Points
- Shuffle: 30 Pookie Points
- Extra Moves: 25 Pookie Points

**Acceptance Criteria:**
- ✅ All power-ups work correctly
- ✅ Purchase system works
- ✅ UI displays counts
- ✅ Disabled when count is 0

---

### Task 7.3: Pookie Points Integration
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Connect to existing Pookie Points system
- [ ] Award points on level completion
- [ ] Deduct points on purchases
- [ ] Display points in UI
- [ ] Add points history

**Files to Update:**
```swift
// ViewModels/PookiePopViewModel.swift
class PookiePopViewModel: ObservableObject {
    @Published var pookiePoints: Int
    
    func awardPoints(_ amount: Int)
    func spendPoints(_ amount: Int) -> Bool
    func syncWithMainApp()
}

// Components/UI/PookiePointsDisplay.swift
struct PookiePointsDisplay: View {
    @ObservedObject var viewModel: PookiePopViewModel
    
    var body: some View {
        HStack {
            Image("PookieCoin") // Custom coin icon
            Text("\(viewModel.pookiePoints)")
                .font(.system(size: 18, weight: .bold))
        }
    }
}
```

**Points Awards:**
- 1 star: 5 points (8 for every 10th level)
- 2 stars: 8 points (12 for every 10th level)
- 3 stars: 12 points (25 for every 10th level)

**Acceptance Criteria:**
- ✅ Points sync with main app
- ✅ Awards work correctly
- ✅ Purchases deduct correctly
- ✅ Display updates in real-time

---

### Task 7.4: Settings & Pause
**Estimated Time**: 3 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Create settings modal
- [ ] Add sound toggle
- [ ] Add music toggle
- [ ] Add haptic toggle
- [ ] Add pause functionality

**File to Create:**
```swift
// Components/UI/SettingsModal.swift
struct SettingsModal: View {
    @ObservedObject var settings: GameSettings
    @Binding var isPresented: Bool
    
    var body: some View {
        ClayModal {
            VStack(spacing: 20) {
                Text("Settings")
                    .font(.system(size: 24, weight: .bold))
                
                Toggle("Sound Effects", isOn: $settings.soundEnabled)
                Toggle("Music", isOn: $settings.musicEnabled)
                Toggle("Haptic Feedback", isOn: $settings.hapticEnabled)
                
                ClayButton("Close") {
                    isPresented = false
                }
            }
        }
    }
}

class GameSettings: ObservableObject {
    @Published var soundEnabled: Bool = true
    @Published var musicEnabled: Bool = true
    @Published var hapticEnabled: Bool = true
}
```

**Acceptance Criteria:**
- ✅ Settings persist between sessions
- ✅ Toggles work correctly
- ✅ Pause stops game timer
- ✅ Resume continues game

---

## 🧪 PHASE 8: Testing & Optimization (Days 17-18)

### Task 8.1: Unit Tests
**Estimated Time**: 6 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Test grid generation
- [ ] Test match detection
- [ ] Test score calculation
- [ ] Test level progression
- [ ] Test lives system
- [ ] Test power-ups

**Files to Create:**
```swift
// Tests/GridGenerationTests.swift
// Tests/MatchDetectionTests.swift
// Tests/ScoreCalculationTests.swift
// Tests/LevelProgressionTests.swift
// Tests/LivesSystemTests.swift
// Tests/PowerUpsTests.swift
```

**Test Coverage Goal**: 80%+

**Acceptance Criteria:**
- ✅ All critical paths tested
- ✅ Edge cases covered
- ✅ All tests pass
- ✅ No flaky tests

---

### Task 8.2: Performance Optimization
**Estimated Time**: 4 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Profile animation performance
- [ ] Optimize particle system
- [ ] Reduce memory usage
- [ ] Optimize grid rendering
- [ ] Test on older devices

**Optimization Targets:**
- 60fps during animations
- < 100MB memory usage
- < 1s level load time
- Smooth scrolling on map

**Acceptance Criteria:**
- ✅ Maintains 60fps
- ✅ No memory leaks
- ✅ Fast load times
- ✅ Works on iPhone 8+

---

### Task 8.3: Bug Fixes & Polish
**Estimated Time**: 6 hours
**Priority**: HIGH

**Subtasks:**
- [ ] Fix any reported bugs
- [ ] Polish animations
- [ ] Improve UI feedback
- [ ] Add loading states
- [ ] Add error handling

**Common Issues to Check:**
- Tiles getting stuck
- Matches not detected
- Animations stuttering
- Sound not playing
- Haptics not triggering
- Lives not regenerating
- Points not syncing

**Acceptance Criteria:**
- ✅ No critical bugs
- ✅ Smooth user experience
- ✅ Proper error handling
- ✅ Loading states everywhere

---

## 📊 PHASE 9: Analytics & Monitoring (Day 19)

### Task 9.1: Analytics Integration
**Estimated Time**: 4 hours
**Priority**: MEDIUM

**Subtasks:**
- [ ] Add analytics events
- [ ] Track level starts
- [ ] Track level completions
- [ ] Track purchases
- [ ] Track power-up usage

**Events to Track:**
```swift
enum PookiePopEvent {
    case levelStart(levelNumber: Int)
    case levelComplete(levelNumber: Int, stars: Int, score: Int, timeElapsed: TimeInterval)
    case levelFail(levelNumber: Int, score: Int, movesUsed: Int)
    case matchMade(size: Int, comboLevel: Int)
    case powerUpUsed(type: PowerUpType)
    case pookiePointsEarned(amount: Int, source: String)
    case pookiePointsSpent(amount: Int, item: String)
    case livesUsed
    case livesPurchased(count: Int)
}
```

**Acceptance Criteria:**
- ✅ All events tracked
- ✅ Data sent to analytics service
- ✅ No PII collected
- ✅ Opt-out respected

---

## 🚀 PHASE 10: Final Integration (Day 20)

### Task 10.1: Dashboard Integration
**Estimated Time**: 2 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Update Dashboard quick action
- [ ] Add navigation to Pookie Pop
- [ ] Test navigation flow
- [ ] Ensure proper dismissal

**File to Update:**
```swift
// Views/Dashboard/DashboardView.swift
QuickActionButton(
    customImage: "PookiePopIcon",
    title: "Pookie Pop",
    color: .purple,
    useCustomFont: true
) {
    showPookiePop = true
}

.sheet(isPresented: $showPookiePop) {
    PookiePopView()
}
```

**Acceptance Criteria:**
- ✅ Button navigates correctly
- ✅ Game loads properly
- ✅ Can return to dashboard
- ✅ State persists

---

### Task 10.2: Final Testing
**Estimated Time**: 4 hours
**Priority**: CRITICAL

**Subtasks:**
- [ ] Full gameplay test (levels 1-10)
- [ ] Test all features
- [ ] Test on multiple devices
- [ ] Test edge cases
- [ ] User acceptance testing

**Test Scenarios:**
1. Complete a level with 3 stars
2. Fail a level
3. Use all power-ups
4. Run out of lives
5. Purchase lives
6. Earn Pookie Points
7. Navigate map
8. Pause and resume
9. Toggle settings
10. Complete 10 levels in a row

**Acceptance Criteria:**
- ✅ All features work
- ✅ No crashes
- ✅ Smooth performance
- ✅ Great user experience

---

## 📝 Summary

### Total Estimated Time: 20 days (160 hours)

### Critical Path:
1. Foundation & Setup (Days 1-2)
2. Core Game Logic (Days 3-4)
3. UI & Rendering (Days 5-6)
4. Animations (Days 7-9)
5. Level System (Days 10-11)
6. Audio & Haptics (Days 12-13)
7. Features & Polish (Days 14-16)
8. Testing & Optimization (Days 17-18)
9. Analytics (Day 19)
10. Final Integration (Day 20)

### Key Milestones:
- ✅ Day 4: Playable prototype
- ✅ Day 9: Full animations working
- ✅ Day 11: Complete level system
- ✅ Day 16: Feature complete
- ✅ Day 20: Production ready

### Next Steps:
1. Review this task breakdown
2. Prioritize tasks based on your timeline
3. Start with Phase 1: Foundation & Setup
4. Work through phases sequentially
5. Test thoroughly at each phase

---

## 🎯 Quick Start Guide

To begin implementation:

1. **Create project structure** (Task 1.1)
2. **Build data models** (Task 1.2)
3. **Create UI components** (Task 1.3)
4. **Implement game logic** (Tasks 2.1-2.4)
5. **Build UI** (Tasks 3.1-3.3)
6. **Add animations** (Tasks 4.1-4.4)
7. **Complete features** (Phases 5-7)
8. **Test & polish** (Phases 8-9)
9. **Integrate & launch** (Phase 10)

Good luck! 🐾
