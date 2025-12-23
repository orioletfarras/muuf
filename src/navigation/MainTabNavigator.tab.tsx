import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Dummy screens for debugging
function DummyHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen (Dummy)</Text>
    </View>
  );
}

function DummyActivities() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activities Screen (Dummy)</Text>
    </View>
  );
}

function DummyStats() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Screen (Dummy)</Text>
    </View>
  );
}

function DummyProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen (Dummy)</Text>
    </View>
  );
}

const iconTextStyle = { fontSize: 24 };

export const MainTabNavigator = () => {
  console.log('MainTabNavigator rendering (debug - minimal config)');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={DummyHome} />
      <Tab.Screen name="Activities" component={DummyActivities} />
      <Tab.Screen name="Stats" component={DummyStats} />
      <Tab.Screen name="Profile" component={DummyProfile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    color: '#000000',
  },
});
