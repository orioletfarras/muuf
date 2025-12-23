import React, { useEffect } from 'react';
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
import { supabase } from './src/lib/supabase';
import { useAuthStore } from './src/stores/authStore';
import * as Linking from 'expo-linking';

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

  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      if (event === 'SIGNED_IN' && session) {
        // User signed in via magic link
        const { loadUser } = useAuthStore.getState();
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        const { logout } = useAuthStore.getState();
        await logout();
      }
    });

    // Handle deep links (magic links)
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);

      // Supabase will automatically handle the auth callback
      // The onAuthStateChange listener above will catch the SIGNED_IN event
    };

    // Listen for incoming deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

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
