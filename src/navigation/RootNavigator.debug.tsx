import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

function DebugScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>RootNavigator Debug Mode</Text>
      <Text style={styles.text}>Navigation loaded successfully</Text>
    </View>
  );
}

export const RootNavigator = () => {
  console.log('RootNavigator rendering (debug mode)');

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Debug"
          component={DebugScreen}
          options={{ title: 'Debug Mode' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 10,
  },
});
