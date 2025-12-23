import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { QuestionnaireNavigator } from './QuestionnaireNavigator';
import { useAuthStore } from '../stores/authStore';
import { Colors } from '../constants/theme';

// Import additional screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import CreateActivityScreen from '../screens/main/CreateActivityScreen';
import ActivityDetailScreen from '../screens/main/ActivityDetailScreen';
import BadgesScreen from '../screens/main/BadgesScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import TeamScreen from '../screens/main/TeamScreen';
import QuestsScreen from '../screens/main/QuestsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import RankingScreen from '../screens/main/RankingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="CreateActivity"
              component={CreateActivityScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Registrar Actividad',
              }}
            />
            <Stack.Screen
              name="ActivityDetail"
              component={ActivityDetailScreen}
              options={{
                headerShown: true,
                title: 'Detalles de Actividad',
              }}
            />
            <Stack.Screen
              name="Badges"
              component={BadgesScreen}
              options={{
                headerShown: true,
                title: 'Mis Insignias',
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: true,
                title: 'Editar Perfil',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                title: 'Configuración',
              }}
            />
            <Stack.Screen
              name="Team"
              component={TeamScreen}
              options={{
                headerShown: true,
                title: 'Mi Equipo',
              }}
            />
            <Stack.Screen
              name="Quests"
              component={QuestsScreen}
              options={{
                headerShown: true,
                title: 'Desafíos',
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: true,
                title: 'Notificaciones',
              }}
            />
            <Stack.Screen
              name="Ranking"
              component={RankingScreen}
              options={{
                headerShown: true,
                title: 'Ranking',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Questionnaire" component={QuestionnaireNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
