# MUUF Components Guide

Complete guide for all reusable components in the MUUF frontend application.

## Table of Contents

1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [LoadingSpinner](#loadingspinner)
5. [EmptyState](#emptystate)
6. [ErrorMessage](#errormessage)
7. [ProgressBar](#progressbar)
8. [Avatar](#avatar)
9. [StatCard](#statcard)
10. [Badge](#badge)

---

## Button

Versatile button component with multiple variants and sizes.

### Props

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
```

### Usage

```tsx
import { Button } from '../components';

// Primary button
<Button
  title="Save"
  onPress={handleSave}
/>

// Secondary button with loading
<Button
  title="Loading..."
  onPress={handleSubmit}
  variant="secondary"
  loading={isLoading}
/>

// Outline button full width
<Button
  title="Cancel"
  onPress={handleCancel}
  variant="outline"
  fullWidth
/>

// Danger button small
<Button
  title="Delete"
  onPress={handleDelete}
  variant="danger"
  size="small"
/>
```

---

## Input

Form input component with validation and error states.

### Props

```typescript
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
}
```

### Usage

```tsx
import { Input } from '../components';

// Basic input
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  keyboardType="email-address"
/>

// Password input
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
/>

// Input with hint
<Input
  label="Duration"
  value={duration}
  onChangeText={setDuration}
  hint="In minutes"
  keyboardType="numeric"
/>
```

---

## Card

Container component with elevation and optional press handling.

### Props

```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
}
```

### Usage

```tsx
import { Card } from '../components';

// Basic card
<Card elevated>
  <Text>Card content</Text>
</Card>

// Card with title
<Card title="Statistics" subtitle="Last 30 days" elevated>
  <View>{/* Stats content */}</View>
</Card>

// Pressable card
<Card
  title="View Details"
  onPress={() => navigation.navigate('Details')}
  elevated
>
  <Text>Tap to see more</Text>
</Card>
```

---

## LoadingSpinner

Loading indicator with optional message.

### Props

```typescript
interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}
```

### Usage

```tsx
import { LoadingSpinner } from '../components';

// Full screen loading
if (isLoading) {
  return <LoadingSpinner message="Loading..." fullScreen />;
}

// Inline loading
<LoadingSpinner message="Fetching data..." />
```

---

## EmptyState

Empty state component with emoji, message, and optional action.

### Props

```typescript
interface EmptyStateProps {
  emoji?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}
```

### Usage

```tsx
import { EmptyState } from '../components';

// With action button
{activities.length === 0 && (
  <EmptyState
    emoji="🏃"
    title="No activities"
    message="Start your fitness journey by adding your first activity"
    actionLabel="+ Add Activity"
    onAction={() => navigation.navigate('CreateActivity')}
  />
)}

// Without action
<EmptyState
  emoji="📊"
  title="No data yet"
  message="Data will appear here once you start tracking"
/>
```

---

## ErrorMessage

Error display component with retry functionality.

### Props

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}
```

### Usage

```tsx
import { ErrorMessage } from '../components';

// With retry
{error && (
  <ErrorMessage
    message={error}
    onRetry={refetch}
  />
)}

// Without retry
<ErrorMessage
  message="Failed to load data"
/>
```

---

## ProgressBar

Animated progress bar component.

### Props

```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}
```

### Usage

```tsx
import { ProgressBar } from '../components';

// Basic progress bar
<ProgressBar progress={75} />

// With custom colors and height
<ProgressBar
  progress={ritmo.percentage}
  height={12}
  color={Colors.success}
  backgroundColor={Colors.border}
  animated
/>

// With label
<ProgressBar
  progress={50}
  showLabel
  label="50% Complete"
/>
```

---

## Avatar

User avatar component with initials fallback.

### Props

```typescript
interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}
```

### Usage

```tsx
import { Avatar } from '../components';

// With image
<Avatar
  name="John Doe"
  imageUrl="https://example.com/avatar.jpg"
  size="large"
/>

// With initials
<Avatar
  name="Jane Smith"
  size="medium"
/>

// Custom colors
<Avatar
  name="Alex Johnson"
  size="small"
  backgroundColor={Colors.secondary}
  textColor={Colors.white}
/>
```

### Size Reference

- **small**: 32x32px
- **medium**: 48x48px (default)
- **large**: 64x64px
- **xlarge**: 96x96px

---

## StatCard

Statistics display card with icon and value.

### Props

```typescript
interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}
```

### Usage

```tsx
import { StatCard } from '../components';

// Basic stat card
<StatCard
  icon="🏃"
  label="Total Activities"
  value={42}
  subtitle="This month"
/>

// Pressable with custom color
<StatCard
  icon="🔥"
  label="Current Streak"
  value="7 days"
  color={Colors.error}
  onPress={() => navigation.navigate('Streaks')}
/>

// Points display
<StatCard
  icon="⭐"
  label="Total Points"
  value={formatPoints(1250)}
  subtitle="Rank #5"
  color={Colors.primary}
/>
```

---

## Badge

Small label/tag component for statuses and categories.

### Props

```typescript
interface BadgeComponentProps {
  label: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}
```

### Usage

```tsx
import { BadgeComponent } from '../components';

// Success badge
<BadgeComponent
  label="Completed"
  variant="success"
/>

// Warning badge small
<BadgeComponent
  label="Pending"
  variant="warning"
  size="small"
/>

// Custom badge
<BadgeComponent
  label="Premium"
  variant="info"
  size="large"
/>
```

### Variant Colors

- **default**: Gray background
- **success**: Green background
- **error**: Red background
- **warning**: Orange background
- **info**: Blue background

---

## Component Combinations

### Example: User Profile Header

```tsx
<View style={styles.profileHeader}>
  <Avatar
    name={user.full_name}
    imageUrl={user.avatar_url}
    size="xlarge"
  />
  <Text style={styles.name}>{user.full_name}</Text>
  <BadgeComponent
    label={user.is_premium ? 'Premium' : 'Free'}
    variant={user.is_premium ? 'success' : 'default'}
  />
</View>
```

### Example: Activity Card

```tsx
<Card elevated onPress={() => viewActivity(activity.id)}>
  <View style={styles.activityHeader}>
    <Text style={styles.activityType}>{activity.type}</Text>
    <BadgeComponent
      label={activity.intensity}
      variant="warning"
      size="small"
    />
  </View>
  <ProgressBar
    progress={activity.completion}
    height={8}
    color={Colors.primary}
  />
  <Text style={styles.activityStats}>
    {activity.duration} min • {activity.points} pts
  </Text>
</Card>
```

### Example: Loading State

```tsx
{isLoading ? (
  <LoadingSpinner message="Loading activities..." fullScreen />
) : activities.length === 0 ? (
  <EmptyState
    emoji="🏃"
    title="No activities"
    message="Add your first activity to get started"
    actionLabel="+ Add Activity"
    onAction={handleAddActivity}
  />
) : (
  activities.map(activity => <ActivityCard key={activity.id} {...activity} />)
)}
```

### Example: Stats Dashboard

```tsx
<ScrollView>
  <StatCard
    icon="🏃"
    label="Activities"
    value={stats.totalActivities}
    subtitle="This month"
    color={Colors.primary}
  />
  <StatCard
    icon="⏱️"
    label="Duration"
    value={`${stats.totalMinutes} min`}
    subtitle="Total time"
    color={Colors.secondary}
  />
  <StatCard
    icon="🔥"
    label="Streak"
    value={`${stats.currentStreak} days`}
    subtitle={`Best: ${stats.longestStreak}`}
    color={Colors.error}
  />
</ScrollView>
```

---

## Best Practices

### Do's ✅

- Use `Button` for all clickable actions
- Use `Input` for all text input fields
- Wrap related content in `Card` components
- Show `LoadingSpinner` during data fetching
- Show `EmptyState` when no data exists
- Use `ProgressBar` for percentages and completion
- Use `Avatar` for user representations
- Use `StatCard` for metrics and KPIs
- Use `BadgeComponent` for statuses and labels

### Don'ts ❌

- Don't create inline buttons - use `Button` component
- Don't use plain `TextInput` - use `Input` component
- Don't use `Alert.alert` for errors - use `ErrorMessage` or Toast
- Don't hardcode colors - use theme colors
- Don't hardcode spacing - use theme spacing
- Don't create custom progress indicators - use `ProgressBar`

### Performance Tips

- Use `React.memo` for expensive components
- Avoid inline functions in frequently rendered components
- Use `FlatList` for long lists instead of mapping
- Implement virtualization for large datasets

---

## Styling Tips

### Consistent Spacing

```tsx
// Use theme spacing
<View style={{ padding: Spacing.md, marginTop: Spacing.lg }}>
```

### Color Usage

```tsx
// Use theme colors
<Text style={{ color: Colors.text }}>
<View style={{ backgroundColor: Colors.background }}>
```

### Typography

```tsx
// Use theme typography
<Text style={{ fontSize: Typography.size.lg, fontWeight: '700' }}>
```

---

## Accessibility

All components support accessibility:

```tsx
<Button
  title="Submit"
  onPress={handleSubmit}
  accessible
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the current form"
/>
```

---

## Testing Components

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components';

test('button calls onPress when clicked', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Click me" onPress={onPress} />);

  fireEvent.press(getByText('Click me'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## Resources

- [Component Source Code](./src/components/)
- [Theme Constants](./src/constants/theme.ts)
- [TypeScript Types](./src/types/index.ts)

---

**Last Updated**: December 2024
**Version**: 1.0.0
