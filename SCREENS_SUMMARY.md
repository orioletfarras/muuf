# MUUF Frontend - Resumen de Screens Implementados

Este documento resume todos los screens implementados en la aplicación MUUF.

## Última actualización: 2025-12-19

---

## Screens de Autenticación

### 1. OnboardingScreen
**Ubicación:** `src/screens/onboarding/OnboardingScreen.tsx`

**Descripción:** Pantalla de bienvenida con swiper de 4 slides

**Características:**
- 4 slides informativos con emojis
- Navegación: Skip, Siguiente, Empezar
- Indicadores de paginación
- Animaciones suaves
- Navega a Auth al completar

**Slides:**
1. Bienvenido a MUUF 🏃
2. Seguimiento Personalizado 📊
3. Compite y Gana 🏆
4. ¡Comencemos! 🎯

---

### 2. LoginScreen
**Ubicación:** `src/screens/auth/LoginScreen.tsx`

**Descripción:** Pantalla de inicio de sesión

**Características:**
- Formulario con email y contraseña
- Validación de campos
- Manejo de errores
- Navegación a RegisterScreen
- Guarda token en SecureStore

---

### 3. RegisterScreen
**Ubicación:** `src/screens/auth/RegisterScreen.tsx`

**Descripción:** Pantalla de registro de usuario

**Características:**
- Formulario completo de registro
- Validación de campos
- Confirmación de contraseña
- Navegación a LoginScreen
- Creación de cuenta automática

---

## Tabs Principales (Bottom Tabs)

### 4. HomeScreen
**Ubicación:** `src/screens/main/HomeScreen.tsx`

**Descripción:** Dashboard principal con resumen de actividad

**Características:**
- Información del usuario con Avatar
- Progreso de Ritmo Semanal
- Progreso de Balance
- Acciones rápidas:
  - ➕ Nueva Actividad
  - 🏆 Ranking
  - 🔔 Notificaciones
  - 🎯 Desafíos
  - 👥 Equipo
- Pull-to-refresh
- useRefreshOnFocus hook
- ProgressBars animadas
- Badges de estado

---

### 5. ActivitiesScreen
**Ubicación:** `src/screens/main/ActivitiesScreen.tsx`

**Descripción:** Listado de actividades del usuario

**Características:**
- Lista de actividades con detalles
- Cards tappables (navegan a ActivityDetail)
- Botón de eliminar por actividad
- Botón "Nueva Actividad"
- Pull-to-refresh
- EmptyState cuando no hay actividades
- Muestra: tipo, fecha, duración, distancia, puntos

---

### 6. StatsScreen
**Ubicación:** `src/screens/main/StatsScreen.tsx`

**Descripción:** Estadísticas detalladas del usuario

**Características:**
- Estadísticas totales
- Gráficos de progreso
- Desglose por tipo de actividad
- Tendencias semanales/mensuales

---

### 7. ProfileScreen
**Ubicación:** `src/screens/main/ProfileScreen.tsx`

**Descripción:** Perfil del usuario

**Características:**
- Avatar con inicial
- Información personal completa
- Datos físicos (altura, peso, IMC)
- Información de cuenta
- Botones de acción:
  - Editar Perfil
  - 🏅 Ver Insignias
  - 👥 Mi Equipo
  - 🎯 Desafíos
  - ⚙️ Configuración
  - Cerrar Sesión
- Cálculo de IMC con categoría

---

## Screens de Actividades

### 8. CreateActivityScreen
**Ubicación:** `src/screens/main/CreateActivityScreen.tsx`

**Descripción:** Formulario para registrar nueva actividad

**Características:**
- Selección de tipo de actividad (grid con emojis)
- Campos: duración, distancia, intensidad, calorías, ritmo cardíaco
- Selector de fecha/hora
- Campo de notas
- Opción de foto (placeholder)
- Validación de campos
- Toast notifications
- Presentación modal

---

### 9. ActivityDetailScreen
**Ubicación:** `src/screens/main/ActivityDetailScreen.tsx`

**Descripción:** Detalles completos de una actividad

**Características:**
- Header con emoji y tipo de actividad
- Card de puntos ganados destacada
- Detalles completos:
  - Duración
  - Distancia
  - Intensidad
  - Calorías
  - Ritmo cardíaco
- Notas (si las hay)
- Foto (si la hay)
- Botón de eliminar con confirmación
- Fecha de creación

---

## Screens de Gamificación

### 10. BadgesScreen
**Ubicación:** `src/screens/main/BadgesScreen.tsx`

**Descripción:** Colección de insignias del usuario

**Características:**
- Grid de badges ganadas
- Badges bloqueadas (gris)
- Información de progreso
- Categorías de badges
- Fecha de obtención
- Contador total

---

### 11. QuestsScreen
**Ubicación:** `src/screens/main/QuestsScreen.tsx`

**Descripción:** Desafíos y misiones

**Características:**
- Tabs: Activos / Completados
- Cards de quest con:
  - Icono por tipo (diario, semanal, mensual, especial)
  - Título y descripción
  - Barra de progreso
  - Puntos de recompensa
  - Fecha de expiración
- Tipos de quest con colores:
  - Diario 📅 (azul)
  - Semanal 📆 (primary)
  - Mensual 🗓️ (secondary)
  - Especial ⭐ (verde)
- EmptyState por tab
- Pull-to-refresh

---

### 12. RankingScreen
**Ubicación:** `src/screens/main/RankingScreen.tsx`

**Descripción:** Rankings competitivos

**Características:**
- Selectores de período:
  - Semanal
  - Mensual
  - Histórico
- Selectores de alcance:
  - Mi Equipo
  - Global
- Podio visual para top 3:
  - 🥇 Oro (1er lugar)
  - 🥈 Plata (2do lugar)
  - 🥉 Bronce (3er lugar)
- Lista del resto de usuarios
- Indicadores de cambio de posición (⬆️⬇️)
- Highlight del usuario actual
- Muestra: puntos totales, número de actividades
- Pull-to-refresh

---

## Screens Sociales

### 13. TeamScreen
**Ubicación:** `src/screens/main/TeamScreen.tsx`

**Descripción:** Información y miembros del equipo

**Características:**
- Card de estadísticas del equipo:
  - Nombre del equipo
  - Ranking del equipo
  - Total de miembros
  - Puntos totales
  - Ritmo promedio (con ProgressBar)
  - Balance promedio (con ProgressBar)
- Lista de miembros ordenada por puntos:
  - Avatar
  - Nombre
  - Puntos totales
  - Número de actividades
  - Mini barras de Ritmo y Balance
  - Indicador "Tú" para usuario actual
- Medallas para top 3
- Highlight del usuario actual
- Pull-to-refresh

---

## Screens de Configuración

### 14. EditProfileScreen
**Ubicación:** `src/screens/main/EditProfileScreen.tsx`

**Descripción:** Edición de perfil del usuario

**Características:**
- Avatar grande con opción de cambiar foto
- Sección "Información Personal":
  - Nombre completo
  - Email
- Sección "Datos Físicos":
  - Edad
  - Sexo (botones M/F)
  - Altura (cm)
  - Peso (kg)
- Validación de campos
- Botón "Guardar Cambios"
- Botón "Cancelar"
- Toast notifications
- useForm hook

---

### 15. SettingsScreen
**Ubicación:** `src/screens/main/SettingsScreen.tsx`

**Descripción:** Configuración de la aplicación

**Características:**
- Card de información del usuario
- Sección "Notificaciones":
  - Switch: Todas las notificaciones
  - Switch: Notificaciones Push
  - Switch: Notificaciones por Email
  - Switch: Reporte Semanal
- Sección "Cuenta":
  - Editar Perfil
  - Cambiar Contraseña
- Sección "Aplicación":
  - Privacidad
  - Acerca de (muestra versión)
  - Términos y Condiciones
- Sección "Zona Peligrosa":
  - Cerrar Sesión (con confirmación)
  - Eliminar Cuenta (con doble confirmación)
- Switches funcionales
- Navegación a otras pantallas

---

### 16. NotificationsScreen
**Ubicación:** `src/screens/main/NotificationsScreen.tsx`

**Descripción:** Centro de notificaciones

**Características:**
- Filtros: Todas / No leídas
- Botón "Marcar todas como leídas"
- Cards de notificación con:
  - Icono por tipo
  - Título
  - Mensaje
  - Fecha
  - Indicador de no leída (punto azul)
  - Border izquierdo para no leídas
- Tipos de notificación:
  - 🏆 Logro (verde)
  - 🎯 Desafío (primary)
  - 👥 Equipo (secondary)
  - 🏃 Actividad (info)
  - ⚙️ Sistema (gris)
- Tappable (navega según tipo)
- Marca como leída al abrir
- Pull-to-refresh
- EmptyState

---

## Navegación

### RootNavigator
**Ubicación:** `src/navigation/RootNavigator.tsx`

**Estructura:**
```
- Onboarding (no autenticado)
- Auth (no autenticado)
  - Login
  - Register
- Main (autenticado)
  - Tabs:
    - Home
    - Activities
    - Stats
    - Profile
- Modals/Screens (autenticado):
  - CreateActivity (modal)
  - ActivityDetail
  - Badges
  - EditProfile
  - Settings
  - Team
  - Quests
  - Notifications
  - Ranking
```

---

## Componentes Reutilizables

### Creados:
1. **Button** - Botón con variantes
2. **Input** - Input de texto con label y error
3. **Card** - Tarjeta contenedor
4. **LoadingSpinner** - Indicador de carga
5. **EmptyState** - Estado vacío con icono
6. **ErrorMessage** - Mensaje de error con retry
7. **ProgressBar** - Barra de progreso animada
8. **Avatar** - Avatar con imagen o iniciales
9. **StatCard** - Card de estadística
10. **BadgeComponent** - Badge/etiqueta de estado
11. **SearchBar** - Barra de búsqueda

### Custom Hooks:
1. **useForm** - Manejo de formularios
2. **useApi** - Llamadas a API
3. **useDebounce** - Debounce de valores
4. **useRefreshOnFocus** - Refresh al enfocar screen

### Context:
1. **ToastContext** - Sistema de notificaciones toast

---

## Stores (Zustand)

1. **authStore** - Autenticación y usuario
2. **activityStore** - Actividades
3. **statsStore** - Estadísticas (Ritmo, Balance)
4. **badgeStore** - Insignias

---

## Resumen de Pantallas

**Total de Screens:** 16

**Por Categoría:**
- Autenticación: 3 (Onboarding, Login, Register)
- Tabs Principales: 4 (Home, Activities, Stats, Profile)
- Actividades: 2 (Create, Detail)
- Gamificación: 3 (Badges, Quests, Ranking)
- Sociales: 1 (Team)
- Configuración: 3 (EditProfile, Settings, Notifications)

**Características Generales:**
- ✅ TypeScript estricto
- ✅ Navegación type-safe
- ✅ Pull-to-refresh en la mayoría de screens
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Toast notifications
- ✅ Componentes reutilizables
- ✅ Custom hooks
- ✅ Theme system consistente
- ✅ Responsive design
- ✅ Animaciones

---

## Próximas Mejoras Sugeridas

1. **Implementar foto upload** - En CreateActivity y EditProfile
2. **Añadir gráficas** - En StatsScreen con react-native-charts
3. **Implementar búsqueda** - Usar SearchBar en Activities
4. **Añadir filtros** - En Activities por tipo/fecha
5. **Notificaciones push** - Integrar con expo-notifications
6. **Modo offline** - Con AsyncStorage y sincronización
7. **Animaciones avanzadas** - Con react-native-reanimated
8. **Dark mode** - Soporte para tema oscuro
9. **Internacionalización** - i18n para múltiples idiomas
10. **Tests** - Unit y integration tests

---

## Stack Tecnológico

- **React Native** - Framework
- **Expo** - Desarrollo y build
- **TypeScript** - Type safety
- **React Navigation v7** - Navegación
- **Zustand** - State management
- **Axios** - HTTP client
- **expo-secure-store** - Almacenamiento seguro

---

**Desarrollado para MUUF - Corporate Wellness Gamification Platform**
