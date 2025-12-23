# MUUF Frontend - Development Guide

Complete guide for developing and contributing to the MUUF mobile application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Workflow](#development-workflow)
3. [Adding New Features](#adding-new-features)
4. [Best Practices](#best-practices)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── LoadingSpinner.tsx
│   ├── EmptyState.tsx
│   ├── ErrorMessage.tsx
│   └── index.ts       # Barrel export
│
├── constants/          # App constants
│   ├── theme.ts       # Colors, typography, spacing
│   ├── config.ts      # API configuration
│   └── activities.ts  # Activity type data
│
├── navigation/         # Navigation configuration
│   ├── types.ts       # Navigation types
│   ├── AuthNavigator.tsx
│   ├── MainTabNavigator.tsx
│   └── RootNavigator.tsx
│
├── screens/           # Screen components
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   └── main/
│       ├── HomeScreen.tsx
│       ├── ActivitiesScreen.tsx
│       ├── StatsScreen.tsx
│       ├── ProfileScreen.tsx
│       ├── CreateActivityScreen.tsx
│       └── BadgesScreen.tsx
│
├── services/          # API services
│   └── api.ts         # Axios client with all endpoints
│
├── stores/            # Zustand stores
│   ├── authStore.ts
│   ├── activityStore.ts
│   ├── statsStore.ts
│   ├── badgeStore.ts
│   └── index.ts
│
├── types/             # TypeScript definitions
│   └── index.ts       # All type definitions
│
└── utils/             # Utility functions
    ├── formatters.ts  # Date, number formatting
    ├── validators.ts  # Input validation
    ├── activity.ts    # Activity-related helpers
    └── index.ts
```

## Development Workflow

### 1. Starting Development Server

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### 2. Development Cycle

1. Make code changes
2. Save files (Metro will auto-reload)
3. Test on simulator/device
4. Commit changes

### 3. TypeScript Type Checking

```bash
# Run type checking
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

## Adding New Features

### Creating a New Screen

1. **Create the screen file**:
```typescript
// src/screens/main/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { Colors, Spacing } from '../../constants/theme';

type Props = RootStackScreenProps<'NewScreen'>;

const NewScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default NewScreen;
```

2. **Add navigation type**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  // ... existing screens
  NewScreen: { userId: number }; // Add params if needed
};
```

3. **Register in navigator**:
```typescript
// src/navigation/RootNavigator.tsx
import NewScreen from '../screens/main/NewScreen';

<Stack.Screen name="NewScreen" component={NewScreen} />
```

### Creating a New Component

1. **Create component file**:
```typescript
// src/components/NewComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface NewComponentProps {
  title: string;
  onPress?: () => void;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
});
```

2. **Export from index**:
```typescript
// src/components/index.ts
export { NewComponent } from './NewComponent';
```

### Creating a New Store

1. **Create store file**:
```typescript
// src/stores/newStore.ts
import { create } from 'zustand';
import { api } from '../services/api';

interface NewState {
  data: any[];
  isLoading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
  clearError: () => void;
}

export const useNewStore = create<NewState>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.someEndpoint();
      set({ data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Error',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
```

2. **Export from index**:
```typescript
// src/stores/index.ts
export { useNewStore } from './newStore';
```

### Adding a New API Endpoint

```typescript
// src/services/api.ts
class ApiClient {
  // ... existing code

  async newEndpoint(params: any): Promise<any> {
    const response = await this.client.get('/new-endpoint', { params });
    return response.data;
  }
}
```

## Best Practices

### Component Design

1. **Use functional components with hooks**
```typescript
// Good
const MyComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState(0);
  return <Text>{title}: {count}</Text>;
};

// Avoid
class MyComponent extends React.Component { ... }
```

2. **Extract styles to StyleSheet**
```typescript
// Good
<View style={styles.container} />

// Avoid
<View style={{ flex: 1, padding: 10 }} />
```

3. **Use theme constants**
```typescript
// Good
backgroundColor: Colors.primary

// Avoid
backgroundColor: '#FF6B35'
```

### State Management

1. **Use Zustand for global state**
```typescript
// Global state that needs to be shared
const { user, login } = useAuthStore();
```

2. **Use local state for UI-only state**
```typescript
// Local component state
const [isOpen, setIsOpen] = useState(false);
```

3. **Avoid prop drilling**
```typescript
// Good: Use store
const { user } = useAuthStore();

// Avoid: Passing props through multiple levels
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />
```

### Error Handling

1. **Always handle API errors**
```typescript
try {
  await api.someEndpoint();
} catch (error: any) {
  Alert.alert('Error', error.response?.data?.detail || 'Something went wrong');
}
```

2. **Show loading states**
```typescript
if (isLoading) {
  return <LoadingSpinner message="Loading..." fullScreen />;
}
```

3. **Show empty states**
```typescript
if (data.length === 0) {
  return (
    <EmptyState
      title="No data"
      message="Add your first item"
      actionLabel="Add Item"
      onAction={handleAdd}
    />
  );
}
```

### TypeScript

1. **Always define prop interfaces**
```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onPress: () => void;
}
```

2. **Use type imports**
```typescript
import type { User, Activity } from '../types';
```

3. **Avoid 'any' type**
```typescript
// Good
const data: User[] = [];

// Avoid
const data: any = [];
```

## Common Tasks

### Adding a New Activity Type

1. **Add to enum** (types/index.ts):
```typescript
export enum ActivityType {
  // ... existing
  NEW_TYPE = 'new_type',
}
```

2. **Add to constants** (constants/activities.ts):
```typescript
{
  type: ActivityType.NEW_TYPE,
  emoji: '🆕',
  label: 'New Type',
  description: 'Description',
}
```

3. **Add to utils** (utils/activity.ts):
```typescript
export const getActivityEmoji = (type: ActivityType): string => {
  const emojiMap: Record<ActivityType, string> = {
    // ... existing
    [ActivityType.NEW_TYPE]: '🆕',
  };
  return emojiMap[type] || '💪';
};
```

### Changing API URL

Edit `src/constants/config.ts`:
```typescript
export const Config = {
  API_URL: __DEV__
    ? 'http://YOUR_LOCAL_IP:8000/api'  // Change this
    : 'https://api.muuf.com/api',
};
```

For physical devices, use your computer's IP address:
```typescript
API_URL: 'http://192.168.1.100:8000/api'
```

### Adding a New Color

Edit `src/constants/theme.ts`:
```typescript
export const Colors = {
  // ... existing
  newColor: '#HEXCODE',
} as const;
```

### Customizing Navigation

**Change tab bar icons**:
```typescript
// src/navigation/MainTabNavigator.tsx
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
  }}
/>
```

**Add modal screen**:
```typescript
<Stack.Screen
  name="ModalScreen"
  component={ModalScreen}
  options={{ presentation: 'modal' }}
/>
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --clear

# Reset Metro cache
npx react-native start --reset-cache
```

### TypeScript Errors

```bash
# Regenerate TypeScript definitions
npx tsc --noEmit

# Check for missing dependencies
npm install
```

### iOS Simulator Issues

```bash
# Rebuild iOS app
cd ios && pod install && cd ..
npm run ios
```

### Android Emulator Issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npm run android
```

### Network Request Failed

1. Check backend is running
2. Verify API_URL in config.ts
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For physical device, use your computer's IP address
5. Check firewall settings

### Debugging

1. **Console logs**:
```typescript
console.log('Debug:', data);
```

2. **React DevTools**:
   - Shake device/simulator
   - Select "Debug JS Remotely"
   - Open Chrome DevTools

3. **Network debugging**:
```typescript
// In api.ts, add interceptor
this.client.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  }
);
```

## Code Style

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Files**: camelCase or PascalCase
- **Variables**: camelCase (`myVariable`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Interfaces/Types**: PascalCase (`UserProfile`)
- **Stores**: camelCase with 'use' prefix (`useAuthStore`)

### File Organization

- One component per file
- Export component as default
- Group related files in folders
- Keep files under 300 lines

### Import Order

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. React Native imports
import { View, Text, StyleSheet } from 'react-native';

// 3. Third-party imports
import { useNavigation } from '@react-navigation/native';

// 4. Local imports - Types
import type { User } from '../../types';

// 5. Local imports - Components
import { Button, Card } from '../../components';

// 6. Local imports - Stores/Services
import { useAuthStore } from '../../stores';
import { api } from '../../services/api';

// 7. Local imports - Utils/Constants
import { formatDate } from '../../utils';
import { Colors } from '../../constants/theme';
```

## Performance Tips

1. **Use React.memo for expensive components**
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component code
});
```

2. **Avoid inline functions in render**
```typescript
// Good
const handlePress = useCallback(() => {
  // Handle press
}, []);

// Avoid
<Button onPress={() => console.log('pressed')} />
```

3. **Use FlatList for long lists**
```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={(item) => item.id.toString()}
/>
```

4. **Optimize images**
   - Use appropriate image sizes
   - Consider using FastImage for caching

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

Happy coding! 🚀
