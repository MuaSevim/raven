import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TaskListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tasks</Text>
      <Text>Task list will be displayed here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
