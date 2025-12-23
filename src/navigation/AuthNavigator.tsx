import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  console.log('AuthNavigator rendering');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        listeners={{
          focus: () => console.log('Login screen focused'),
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        listeners={{
          focus: () => console.log('Register screen focused'),
        }}
      />
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
        listeners={{
          focus: () => console.log('CompleteProfile screen focused'),
        }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        listeners={{
          focus: () => console.log('OTPVerification screen focused'),
        }}
      />
    </Stack.Navigator>
  );
};
