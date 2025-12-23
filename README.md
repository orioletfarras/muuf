# MUUF Frontend - React Native / Expo

Mobile application for the MUUF corporate wellness gamification platform.

## Tech Stack

- **React Native** with **Expo** (TypeScript)
- **Zustand** for state management
- **React Navigation** (Stack + Tab navigators)
- **Axios** for API client
- **expo-secure-store** for secure token storage

## Project Structure

```
src/
├── components/       # Reusable UI components (Button, Input, Card)
├── constants/        # Theme, colors, config
├── navigation/       # Navigation setup (Auth, Main Tab, Root)
├── screens/          # Screen components
│   ├── auth/        # Login, Register
│   └── main/        # Home, Activities, Stats, Profile
├── services/         # API client
├── stores/           # Zustand stores (auth, activity, stats, badges)
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Configuration

The app uses different API URLs for development and production:

- **Development**: `http://localhost:8000/api`
- **Production**: `https://api.muuf.com/api`

Edit `src/constants/config.ts` to change these values.

## Features

### Authentication
- Login with email/password
- Registration with validation
- JWT token management with automatic refresh
- Secure token storage using expo-secure-store

### Home Dashboard
- Ritmo (weekly activity target) progress
- Balance (activity distribution) status
- Quick actions to navigate to activities and stats

### Activities
- List all user activities
- View activity details (duration, distance, points)
- Delete activities
- Pull to refresh

### Statistics
- Weekly rankings (Top 10)
- User position in ranking
- Points and levels

### Profile
- User information
- Personal data (height, weight, BMI)
- Account status
- Logout

## State Management

The app uses **Zustand** for global state:

- `authStore` - User authentication and profile
- `activityStore` - Activities CRUD
- `statsStore` - Ritmo, Balance, Rankings
- `badgeStore` - User badges and achievements

## Navigation

```
Root Navigator
├── Auth Stack (not authenticated)
│   ├── Login
│   └── Register
└── Main Tab Navigator (authenticated)
    ├── Home
    ├── Activities
    ├── Stats
    └── Profile
```

## API Client

The API client (`src/services/api.ts`) handles:
- Automatic JWT token injection
- Token refresh on 401 errors
- Error handling
- All backend endpoints

## Theme

Centralized theme configuration in `src/constants/theme.ts`:
- Colors (primary, secondary, success, error, etc.)
- Typography (sizes, weights)
- Spacing (xs, sm, md, lg, xl, xxl)
- Border radius
- Shadows

## Components

### Button
```tsx
<Button
  title="Login"
  onPress={handleLogin}
  variant="primary" // primary, secondary, outline, danger
  size="medium"     // small, medium, large
  loading={isLoading}
  fullWidth
/>
```

### Input
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  error={emailError}
  hint="Enter your email address"
  secureTextEntry // for passwords
/>
```

### Card
```tsx
<Card
  title="Title"
  subtitle="Subtitle"
  onPress={() => {}}
  elevated
>
  <Text>Card content</Text>
</Card>
```

## Development

### Running the app

```bash
# Start Metro bundler
npm start

# Clear cache if needed
npm start -- --clear
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npx eslint .
```

## Building for Production

### iOS

```bash
# Build for iOS
expo build:ios

# Submit to App Store
expo submit:ios
```

### Android

```bash
# Build for Android
expo build:android

# Submit to Google Play
expo submit:android
```

## Environment Variables

Create a `.env` file in the root:

```env
API_URL=http://localhost:8000/api
```

## Troubleshooting

### "Unable to resolve module"
```bash
npm start -- --clear
```

### "Network request failed"
- Check that the backend is running
- For iOS simulator, use `http://localhost:8000`
- For Android emulator, use `http://10.0.2.2:8000`
- For physical device, use your computer's IP address

### Token issues
- Clear app data/cache
- Check token expiration times in backend config

## Next Steps

- [ ] Add activity creation screen
- [ ] Add activity detail screen
- [ ] Add badges screen
- [ ] Add profile editing
- [ ] Add onboarding flow
- [ ] Add push notifications
- [ ] Add activity photos
- [ ] Add social features (teams, challenges)
- [ ] Add offline support
- [ ] Add analytics

## License

Proprietary - MUUF Platform
