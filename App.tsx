import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/context/ToastContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  useFonts,
  Fustat_200ExtraLight,
  Fustat_300Light,
  Fustat_400Regular,
  Fustat_500Medium,
  Fustat_600SemiBold,
  Fustat_700Bold,
  Fustat_800ExtraBold,
} from '@expo-google-fonts/fustat';

export default function App() {
  console.log('App rendering - Production Mode');

  const [fontsLoaded] = useFonts({
    Fustat_200ExtraLight,
    Fustat_300Light,
    Fustat_400Regular,
    Fustat_500Medium,
    Fustat_600SemiBold,
    Fustat_700Bold,
    Fustat_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
