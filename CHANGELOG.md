# Changelog

All notable changes to the MUUF Frontend will be documented in this file.

## [1.0.0] - 2024-12-19

### Added - Initial Release

#### Core Features
- **Authentication System**
  - Login with email/password
  - User registration with validation
  - JWT token management with automatic refresh
  - Secure token storage using expo-secure-store
  - Auto-login on app start

#### Main Screens
- **Home Dashboard**
  - Ritmo (weekly activity target) progress display
  - Balance (activity distribution) status
  - Color-coded progress indicators
  - Incentive messages from backend
  - Quick action buttons
  - Pull-to-refresh functionality

- **Activities Screen**
  - List all user activities
  - Activity cards with emoji icons
  - Display duration, distance, and points
  - Delete activity functionality
  - Empty state with call-to-action
  - Pull-to-refresh

- **Create Activity Screen**
  - 13 activity types with emoji icons
  - Grid selection interface
  - Duration and distance inputs
  - 3 intensity levels (Baja, Media, Alta)
  - Form validation
  - Modal presentation

- **Stats & Rankings**
  - Weekly top 10 ranking
  - User position display
  - Medal emojis for top 3 (🥇🥈🥉)
  - Points and levels
  - Total participants count

- **Badges Screen**
  - Badge collection overview
  - Unlocked badges with unlock dates
  - Locked badges with progress
  - Progress bars and percentages
  - Feature badge functionality
  - 14 different badge types

- **Profile Screen**
  - User information display
  - Avatar with initials
  - Personal data (height, weight, sex, age)
  - BMI calculation with categories
  - Account status
  - Edit profile button (placeholder)
  - Navigate to badges
  - Logout functionality

#### Components Library
- **Button Component**
  - 4 variants: primary, secondary, outline, danger
  - 3 sizes: small, medium, large
  - Loading state with spinner
  - Disabled state
  - Full width option

- **Input Component**
  - Label and error message support
  - Left and right icon slots
  - Password toggle for secure inputs
  - Focus state styling
  - Hint text support
  - Error state styling

- **Card Component**
  - Title and subtitle support
  - Elevated shadow option
  - Pressable variant
  - Consistent padding and border radius

- **LoadingSpinner Component**
  - Optional message
  - Full screen and inline variants
  - Themed color

- **EmptyState Component**
  - Customizable emoji
  - Title and message
  - Optional action button
  - Centered layout

- **ErrorMessage Component**
  - Error icon and styling
  - Retry button option
  - Bordered container

#### State Management (Zustand)
- **authStore**
  - User authentication and profile
  - Login, register, logout actions
  - Load user from cached token
  - Update user profile
  - Error handling

- **activityStore**
  - Activity CRUD operations
  - Fetch activities with filters
  - Create activity
  - Delete activity
  - Error handling

- **statsStore**
  - Ritmo status
  - Balance status
  - Individual ranking
  - Error handling

- **badgeStore**
  - Badge collection
  - Feature badge
  - Error handling

#### API Client (Axios)
- **Configuration**
  - Base URL configuration for dev/prod
  - 30-second timeout
  - JSON content type

- **Interceptors**
  - Automatic JWT token injection
  - Token refresh on 401 errors
  - Request queuing during refresh
  - Error handling

- **Endpoints**
  - Auth: login, register, logout, refresh
  - Users: profile, update, stats
  - Activities: CRUD, summary
  - Stats: Ritmo, Balance, Rankings
  - Badges: collection, feature
  - Health check

#### Navigation
- **Root Navigator**
  - Auth/Main stack switching
  - Loading state during auth check
  - Modal presentation for creation screens

- **Auth Stack**
  - Login screen
  - Register screen
  - No header

- **Main Tab Navigator**
  - 4 tabs: Home, Activities, Stats, Profile
  - Emoji icons
  - Spanish labels
  - Themed colors

#### Utilities
- **Formatters**
  - `formatDate()` - Readable date strings
  - `formatDateTime()` - Date with time
  - `formatRelativeTime()` - "Hace 2 horas"
  - `formatDuration()` - Minutes to readable format
  - `formatDistance()` - Kilometers formatting
  - `formatPoints()` - Thousands separator
  - `formatPercentage()` - Percentage formatting
  - `formatBMI()` - BMI calculation
  - `capitalize()` - String capitalization
  - `truncate()` - Text truncation

- **Validators**
  - `isValidEmail()` - Email format
  - `isValidPassword()` - Password strength
  - `isValidPhone()` - Spanish phone format
  - `isPositiveNumber()` - Positive number check
  - `isInteger()` - Integer validation
  - `isNotFutureDate()` - Date validation
  - `isValidAge()` - Age range (14-120)
  - `isValidHeight()` - Height range (100-250 cm)
  - `isValidWeight()` - Weight range (30-300 kg)
  - `isValidURL()` - URL format

- **Activity Helpers**
  - `getActivityEmoji()` - Emoji for activity type
  - `getActivityName()` - Readable activity name
  - `getIntensityColor()` - Color for intensity
  - `getIntensityName()` - Intensity label
  - `getActivityCategory()` - Activity category
  - `estimateCalories()` - Calorie estimation
  - `calculatePace()` - Pace calculation (min/km)
  - `calculateSpeed()` - Speed calculation (km/h)

#### Theme System
- **Colors**
  - Primary: #FF6B35 (Orange)
  - Secondary: #4ECDC4 (Teal)
  - Background: #FFFFFF, #F5F5F5
  - Text: #212121, #666666
  - Status: Success, Warning, Error, Info

- **Typography**
  - 7 sizes: xs (12px) to xxl (32px)
  - Font weights: 400, 500, 600, 700

- **Spacing**
  - 7 sizes: xs (4px) to xxl (48px)
  - Consistent padding/margin scale

- **Border Radius**
  - 4 sizes: small (4px) to xlarge (24px)

- **Shadows**
  - 3 levels: small, medium, large
  - Platform-specific (iOS/Android)

#### Constants
- **Config**
  - API URL (dev/prod)
  - Storage keys
  - Timeouts
  - App info

- **Activities**
  - 13 activity type definitions
  - Emoji, label, description
  - Distance requirement flags
  - 3 intensity level definitions

#### TypeScript Types
- Complete type definitions for:
  - User, UserStats
  - Auth (Login, Register, Tokens)
  - Activity (13 types, 3 intensity levels)
  - Badge (Badge, UserBadge, BadgeProgress, BadgeCollection)
  - Stats (Ritmo, Balance, Rankings)
  - API responses and errors

#### Documentation
- README.md - Overview and setup
- DEVELOPMENT_GUIDE.md - Comprehensive dev guide
- CHANGELOG.md - This file

### Technical Details

#### Dependencies
```json
{
  "expo": "~52.0.21",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "zustand": "^5.0.2",
  "axios": "^1.7.9",
  "@react-navigation/native": "^7.0.10",
  "@react-navigation/native-stack": "^7.1.10",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "expo-secure-store": "~14.0.0",
  "react-native-safe-area-context": "^4.12.0"
}
```

#### Project Statistics
- **Total Files**: 35+
- **Lines of Code**: ~4,000
- **Components**: 6
- **Screens**: 8
- **Stores**: 4
- **Utilities**: 20+ functions
- **Type Definitions**: 100+

#### Platform Support
- ✅ iOS (Simulator & Device)
- ✅ Android (Emulator & Device)
- ⚠️ Web (Basic support)

### Known Issues
- Photo upload not yet implemented
- Edit profile functionality pending
- Web platform has limited testing

### Future Enhancements
See README.md "Next Steps" section for planned features.

---

## Version History

**1.0.0** - Initial production-ready release with complete authentication, activity tracking, stats, and badges.
