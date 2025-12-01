import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'tamagui';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Raven</Text>
      <Text style={styles.subtitle}>Connect Scribes with Ravens</Text>
      <Button theme="active" size="$6" marginTop="$4">
        Get Started
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});
