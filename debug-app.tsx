/**
 * Debug version of App to find JSI error
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './src/constants/theme';

// Test individual imports
console.log('=== TESTING THEME IMPORTS ===');
console.log('Colors:', typeof Colors);
console.log('Colors.primary:', Colors.primary);

export default function DebugApp() {
  console.log('=== RENDERING DEBUG APP ===');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debug App Loaded</Text>
      <Text style={styles.text}>Check console for errors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
});
