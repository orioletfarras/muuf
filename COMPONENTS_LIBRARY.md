# MUUF Component Library

Librería completa de componentes reutilizables para MUUF Frontend.

## Última actualización: 2025-12-19

---

## 📦 Componentes Básicos

### 1. Button
**Archivo:** `src/components/Button.tsx`

Botón versátil con múltiples variantes y tamaños.

**Props:**
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<Button
  title="Guardar"
  onPress={handleSave}
  variant="primary"
  size="large"
  fullWidth
/>
```

**Variantes:**
- `primary` - Fondo azul, texto blanco
- `secondary` - Fondo gris, texto oscuro
- `outline` - Borde, sin fondo
- `danger` - Fondo rojo, para acciones destructivas

---

### 2. Input
**Archivo:** `src/components/Input.tsx`

Campo de entrada de texto con label y error.

**Props:**
```typescript
interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  keyboardType="email-address"
  autoCapitalize="none"
  error={errors.email}
/>
```

---

### 3. Card
**Archivo:** `src/components/Card.tsx`

Contenedor tipo tarjeta con sombra opcional.

**Props:**
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  elevated?: boolean;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<Card title="Estadísticas" subtitle="Últimos 30 días" elevated>
  <Text>Contenido de la tarjeta</Text>
</Card>
```

---

## 🎯 Componentes de UI

### 4. Avatar
**Archivo:** `src/components/Avatar.tsx`

Avatar con imagen o iniciales.

**Props:**
```typescript
interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
}
```

**Tamaños:**
- `small`: 32x32
- `medium`: 48x48
- `large`: 64x64
- `xlarge`: 80x80

**Uso:**
```tsx
<Avatar
  name="Juan Pérez"
  imageUrl="https://..."
  size="large"
/>
```

---

### 5. ProgressBar
**Archivo:** `src/components/ProgressBar.tsx`

Barra de progreso animada.

**Props:**
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<ProgressBar
  progress={75}
  height={12}
  color={Colors.primary}
  animated
/>
```

---

### 6. BadgeComponent
**Archivo:** `src/components/Badge.tsx`

Badge/etiqueta con variantes de color.

**Props:**
```typescript
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<BadgeComponent
  label="Completado"
  variant="success"
  size="small"
/>
```

---

### 7. LevelBadge
**Archivo:** `src/components/LevelBadge.tsx`

Badge de nivel con colores según rango.

**Props:**
```typescript
interface LevelBadgeProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
}
```

**Colores:**
- 1-9: Azul (✨)
- 10-29: Bronce (🌟)
- 30-49: Plata (⭐)
- 50+: Oro (👑)

**Uso:**
```tsx
<LevelBadge
  level={25}
  size="medium"
  showLabel
/>
```

---

## 📊 Componentes de Datos

### 8. StatCard
**Archivo:** `src/components/StatCard.tsx`

Card de estadística con icono.

**Props:**
```typescript
interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<StatCard
  label="Actividades"
  value="24"
  icon="🏃"
  trend="up"
  trendValue="+12%"
/>
```

---

### 9. StreakCard
**Archivo:** `src/components/StreakCard.tsx`

Card de rachas con emojis dinámicos.

**Props:**
```typescript
interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  unit?: 'días' | 'semanas';
  style?: ViewStyle;
}
```

**Emojis por racha:**
- 0: 🌱
- 1-2: 💪
- 3-6: ✨
- 7-13: ⚡
- 14-29: 🔥
- 30+: 🔥

**Uso:**
```tsx
<StreakCard
  currentStreak={7}
  longestStreak={14}
  unit="días"
/>
```

---

## 🎨 Componentes de Navegación

### 10. TabSelector
**Archivo:** `src/components/TabSelector.tsx`

Selector de tabs con 3 variantes.

**Props:**
```typescript
interface TabSelectorProps {
  tabs: Tab[];
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  style?: ViewStyle;
}

interface Tab {
  id: string;
  label: string;
  count?: number;
}
```

**Variantes:**
- `default`: iOS-style con fondo
- `pills`: Pills individuales
- `underline`: Material Design

**Uso:**
```tsx
const tabs: Tab[] = [
  { id: 'week', label: 'Semana', count: 12 },
  { id: 'month', label: 'Mes', count: 48 },
];

<TabSelector
  tabs={tabs}
  selectedTab="week"
  onSelectTab={setSelected}
  variant="default"
/>
```

---

### 11. FilterChip
**Archivo:** `src/components/FilterChip.tsx`

Chip de filtro seleccionable.

**Props:**
```typescript
interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<FilterChip
  label="Correr"
  icon="🏃"
  selected={filter === 'running'}
  onPress={() => setFilter('running')}
/>
```

---

## 🔍 Componentes de Búsqueda

### 12. SearchBar
**Archivo:** `src/components/SearchBar.tsx`

Barra de búsqueda con botón de limpiar.

**Props:**
```typescript
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Buscar..."
  onClear={() => setSearchQuery('')}
/>
```

---

## ⏰ Componentes de Tiempo

### 13. DateTimeSelector
**Archivo:** `src/components/DateTimeSelector.tsx`

Selector de fecha/hora.

**Props:**
```typescript
interface DateTimeSelectorProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<DateTimeSelector
  label="Fecha y hora"
  value={selectedDate}
  onChange={setSelectedDate}
  mode="datetime"
/>
```

---

## 🎯 Componentes de Acción

### 14. FloatingActionButton
**Archivo:** `src/components/FloatingActionButton.tsx`

Botón flotante con sombra.

**Props:**
```typescript
interface FloatingActionButtonProps {
  icon?: string;
  label?: string;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}
```

**Tamaños:**
- `small`: 48x48
- `medium`: 56x56
- `large`: 64x64

**Uso:**
```tsx
<FloatingActionButton
  icon="+"
  onPress={() => navigate('Create')}
  position="bottom-right"
  size="large"
/>
```

---

## 🎭 Componentes de Estado

### 15. LoadingSpinner
**Archivo:** `src/components/LoadingSpinner.tsx`

Indicador de carga.

**Props:**
```typescript
interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}
```

**Uso:**
```tsx
<LoadingSpinner
  message="Cargando datos..."
  fullScreen
  size="large"
/>
```

---

### 16. EmptyState
**Archivo:** `src/components/EmptyState.tsx`

Estado vacío con icono y acción.

**Props:**
```typescript
interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<EmptyState
  icon="🏃"
  title="No hay actividades"
  message="Registra tu primera actividad"
  actionLabel="+ Nueva"
  onAction={() => navigate('Create')}
/>
```

---

### 17. ErrorMessage
**Archivo:** `src/components/ErrorMessage.tsx`

Mensaje de error con retry.

**Props:**
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}
```

**Uso:**
```tsx
<ErrorMessage
  message="Error al cargar datos"
  onRetry={loadData}
/>
```

---

## 📱 Guía de Uso

### Importación

Todos los componentes se pueden importar desde `'../../components'`:

```typescript
import {
  Button,
  Input,
  Card,
  Avatar,
  ProgressBar,
  StatCard,
  StreakCard,
  TabSelector,
  FilterChip,
  SearchBar,
  FloatingActionButton,
  LevelBadge,
  DateTimeSelector,
  LoadingSpinner,
  EmptyState,
  ErrorMessage,
  BadgeComponent,
} from '../../components';
```

---

## 🎨 Theme System

Todos los componentes utilizan el theme centralizado:

```typescript
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
```

### Colors
```typescript
Colors.primary
Colors.secondary
Colors.success
Colors.warning
Colors.error
Colors.info
Colors.text
Colors.textSecondary
Colors.background
Colors.backgroundSecondary
Colors.border
Colors.white
```

### Spacing
```typescript
Spacing.xs   // 4
Spacing.sm   // 8
Spacing.md   // 16
Spacing.lg   // 24
Spacing.xl   // 32
Spacing.xxl  // 48
```

### Typography
```typescript
Typography.size.xs    // 10
Typography.size.sm    // 12
Typography.size.md    // 14
Typography.size.lg    // 16
Typography.size.xl    // 20
Typography.size.xxl   // 28
```

### BorderRadius
```typescript
BorderRadius.sm   // 4
BorderRadius.md   // 8
BorderRadius.lg   // 12
BorderRadius.full // 9999
```

---

## 🏗️ Arquitectura

### Estructura de Archivos

```
src/components/
├── Button.tsx
├── Input.tsx
├── Card.tsx
├── Avatar.tsx
├── ProgressBar.tsx
├── StatCard.tsx
├── BadgeComponent.tsx (Badge.tsx)
├── LevelBadge.tsx
├── StreakCard.tsx
├── TabSelector.tsx
├── FilterChip.tsx
├── SearchBar.tsx
├── DateTimeSelector.tsx
├── FloatingActionButton.tsx
├── LoadingSpinner.tsx
├── EmptyState.tsx
├── ErrorMessage.tsx
└── index.ts  (barrel export)
```

### Barrel Export

El archivo `index.ts` exporta todos los componentes:

```typescript
export { Button } from './Button';
export { Input } from './Input';
// ... etc
```

---

## ✨ Mejores Prácticas

### 1. TypeScript Estricto
Todos los componentes usan TypeScript con props type-safe.

### 2. Props Opcionales
Usa valores por defecto sensatos:
```typescript
variant = 'primary'
size = 'medium'
animated = true
```

### 3. Estilos Consistentes
Siempre usa el theme system, nunca valores hardcoded.

### 4. Accesibilidad
- Labels claros
- Feedback táctil (activeOpacity)
- Mensajes de error descriptivos

### 5. Performance
- React.memo para componentes pesados
- useCallback para funciones
- Animaciones nativas cuando sea posible

---

## 📊 Estadísticas

**Total de componentes:** 17
**Líneas de código:** ~3,500
**Cobertura TypeScript:** 100%
**Reusabilidad:** Alta

**Por categoría:**
- Básicos: 3 (Button, Input, Card)
- UI: 4 (Avatar, ProgressBar, Badge, LevelBadge)
- Datos: 2 (StatCard, StreakCard)
- Navegación: 2 (TabSelector, FilterChip)
- Búsqueda: 1 (SearchBar)
- Tiempo: 1 (DateTimeSelector)
- Acción: 1 (FloatingActionButton)
- Estado: 3 (Loading, Empty, Error)

---

## 🚀 Próximas Mejoras

1. **AnimatedCard** - Card con animaciones de entrada
2. **ImagePicker** - Selector de imágenes
3. **Skeleton** - Loading states con skeletons
4. **BottomSheet** - Modal tipo bottom sheet
5. **SwipeableCard** - Card con swipe actions
6. **Charts** - Componentes de gráficas
7. **Calendar** - Selector de calendario
8. **Checkbox** - Checkbox con label
9. **Radio** - Radio button group
10. **Slider** - Range slider

---

**Desarrollado para MUUF - Corporate Wellness Platform**
**Última actualización:** 2025-12-19
