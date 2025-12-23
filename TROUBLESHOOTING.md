# MUUF Frontend - Troubleshooting Guide

Guía de solución de problemas comunes.

## 📱 Problemas de Dependencias

### Error: "Unable to resolve @react-navigation/native-stack"

**Causa:** Dependencia faltante de React Navigation.

**Solución:**
```bash
npm install @react-navigation/native-stack
```

### Error: Dependencias de navegación faltantes

**Solución completa:**
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

---

## 🔧 Problemas de Build

### Bundle failing

**Solución:**
```bash
# Limpiar caché
expo start --clear

# O reiniciar completamente
npm run reset
npm start
```

### TypeScript errors

**Solución:**
```bash
# Verificar tipos
npm run type-check

# Ver errores específicos
npx tsc --noEmit
```

---

## 📦 Problemas con node_modules

### Dependencias desactualizadas o corruptas

**Solución:**
```bash
# Método 1: Reset completo
npm run reset

# Método 2: Manual
rm -rf node_modules
rm package-lock.json
npm install

# Método 3: Con caché limpia
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Problemas de Expo

### Metro bundler no inicia

**Solución:**
```bash
# Limpiar puerto
killall node
expo start --clear

# O especificar puerto
expo start --port 19001
```

### Expo Go no conecta

**Verificar:**
1. Mismo WiFi en computadora y dispositivo
2. Firewall no bloqueando puertos
3. Reiniciar Expo Go app

**Solución:**
```bash
# Modo tunnel (más lento pero más confiable)
expo start --tunnel

# O usar localhost (solo simuladores)
expo start --localhost
```

---

## 📱 Problemas de Simulador/Emulador

### iOS Simulator no abre

**Solución:**
```bash
# Verificar Xcode instalado
xcode-select --install

# Abrir manualmente
open -a Simulator

# Desde Expo
expo start --ios
```

### Android Emulator no abre

**Solución:**
```bash
# Verificar Android Studio y emulador configurados
# Abrir Android Studio > AVD Manager > Start

# Desde Expo
expo start --android
```

---

## 🔍 Problemas de TypeScript

### Errores de tipos en componentes

**Solución común:**
```typescript
// Problema: Props no definidas
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // ...
};
```

### Module not found

**Verificar imports:**
```typescript
// ✅ Correcto
import { Button } from '../../components';

// ❌ Incorrecto
import { Button } from '../../components/Button';
```

---

## 🎯 Problemas de Navegación

### Screen no navega

**Verificar:**
1. Screen registrado en navigator
2. Nombre correcto en navigation.navigate()
3. Props de navegación pasadas correctamente

**Ejemplo:**
```typescript
// En RootNavigator
<Stack.Screen name="MyScreen" component={MyScreen} />

// En componente
navigation.navigate('MyScreen'); // Nombre exacto
```

### Types de navegación incorrectos

**Solución:**
```typescript
// Actualizar types.ts
export type RootStackParamList = {
  MyScreen: undefined; // Sin params
  DetailScreen: { id: number }; // Con params
};
```

---

## 🎨 Problemas de Estilos

### Estilos no aplicados

**Verificar:**
1. Importar constantes del theme
2. Usar StyleSheet.create()
3. Aplicar style prop correctamente

**Ejemplo:**
```typescript
import { Colors, Spacing } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
});
```

---

## 🔐 Problemas de Autenticación

### Token no persiste

**Verificar:**
```typescript
// En authStore
await SecureStore.setItemAsync('token', token);
const storedToken = await SecureStore.getItemAsync('token');
```

### Usuario no se mantiene logueado

**Solución:**
1. Verificar loadUser() se llama en RootNavigator
2. Verificar token se guarda correctamente
3. Verificar isAuthenticated state

---

## 📡 Problemas de API

### Network request failed

**Verificar:**
1. Backend corriendo
2. API_URL correcta en .env
3. CORS configurado en backend

**Para iOS Simulator:**
```
API_URL=http://localhost:8000/api
```

**Para Android Emulator:**
```
API_URL=http://10.0.2.2:8000/api
```

**Para dispositivo físico:**
```
API_URL=http://192.168.1.XXX:8000/api
```

### 401 Unauthorized

**Solución:**
```typescript
// Verificar interceptor en api.ts
const token = await SecureStore.getItemAsync('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

## 🐛 Debugging

### Usar React DevTools

**Instalación:**
```bash
npm install -g react-devtools
react-devtools
```

### Logs en consola

```typescript
// Development
console.log('Debug:', data);
console.warn('Warning:', message);
console.error('Error:', error);

// Production (remover antes de deploy)
if (__DEV__) {
  console.log('Debug info');
}
```

### Flipper (debugging avanzado)

1. Instalar Flipper desktop app
2. Conectar dispositivo/simulador
3. Ver network, logs, layout, etc.

---

## 🚀 Performance

### App lenta

**Solución:**
1. Usar React.memo para componentes pesados
2. Implementar useCallback para funciones
3. Evitar re-renders innecesarios
4. Optimizar imágenes

**Ejemplo:**
```typescript
const MyComponent = React.memo(({ data }) => {
  const handlePress = useCallback(() => {
    // Lógica
  }, []);

  return <View>...</View>;
});
```

---

## 📱 Problemas Específicos de Plataforma

### iOS

**Problema:** CocoaPods
```bash
cd ios
pod install
cd ..
```

**Problema:** Signing
- Abrir Xcode
- Configurar Team en Signing & Capabilities

### Android

**Problema:** Gradle build failed
```bash
cd android
./gradlew clean
cd ..
```

**Problema:** SDK not found
- Abrir Android Studio
- Configurar SDK en Preferences

---

## 🔄 Comandos Útiles

```bash
# Desarrollo
npm start                    # Iniciar dev server
npm run ios                  # Correr en iOS
npm run android              # Correr en Android

# Calidad de código
npm run lint                 # Lint check
npm run lint:fix             # Lint fix
npm run type-check           # TypeScript check
npm run format               # Format code
npm run validate             # Lint + Type + Format

# Limpieza
npm run clean                # Limpiar node_modules
npm run reset                # Limpiar y reinstalar
expo start --clear           # Limpiar caché Metro
```

---

## 📚 Recursos

### Documentación oficial:
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Comunidad:
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [React Native Community](https://github.com/react-native-community)

---

## ✅ Checklist de Verificación

Antes de pedir ayuda, verificar:

- [ ] Dependencias instaladas (`npm install`)
- [ ] Versión correcta de Node (18+)
- [ ] Expo CLI actualizado
- [ ] Simulador/Emulador funcionando
- [ ] Backend corriendo (si aplica)
- [ ] .env configurado
- [ ] No hay errores de TypeScript
- [ ] Caché limpia
- [ ] Puerto no bloqueado
- [ ] WiFi mismo para ambos dispositivos

---

**Última actualización:** 2025-12-19

Si el problema persiste, revisar logs completos y buscar el error específico en la documentación oficial.
