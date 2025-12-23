import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';

// Disable native screens to avoid type mismatch issues
enableScreens(false);

// Enable all logs including warnings
LogBox.ignoreAllLogs(false);

// Add global error handler to see full stack traces
const originalErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', error);
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('Is Fatal:', isFatal);
  console.error('Error Name:', error.name);
  console.error('============================');

  // Call original handler
  if (originalErrorHandler) {
    originalErrorHandler(error, isFatal);
  }
});

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
