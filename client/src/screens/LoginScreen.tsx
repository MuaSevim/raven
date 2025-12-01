  import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, YStack } from 'tamagui';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // TODO: Implement Firebase authentication
    console.log('Login with:', email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <YStack space="$4" width="100%" maxWidth={400} padding="$4">
        <Input
          size="$4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          size="$4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button theme="active" size="$5" onPress={handleLogin}>
          Sign In
        </Button>
        
        <Button size="$4" variant="outlined">
          Create Account
        </Button>
      </YStack>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
