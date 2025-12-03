import React, { useState } from 'react';
import { YStack, XStack, Text, Button, Input, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed', { email, password });
  };

  const handleSignUp = () => {
    console.log('Sign up pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_COLORS.background }}>
      <YStack flex={1} padding="$6" justifyContent="center">
        {/* Logo / Brand */}
        <YStack alignItems="center" marginBottom="$6">
          {/* Raven Bird Icon */}
          <Text fontSize={60} marginBottom="$2">🦅</Text>
          
          <Text
            fontSize={32}
            fontWeight="800"
            color="$ravenTextPrimary"
            letterSpacing={4}
          >
            RAVEN
          </Text>
          <Text
            fontSize={14}
            color="$ravenTextSecondary"
            marginTop="$1"
            fontStyle="italic"
          >
            "Travel for free"
          </Text>
        </YStack>

        {/* Sign In Header */}
        <Text
          fontSize={24}
          fontWeight="600"
          color="$ravenTextPrimary"
          textAlign="center"
          marginBottom="$6"
        >
          Sign In
        </Text>

        {/* Login Form */}
        <YStack space="$4" width="100%">
          <Input
            size="$5"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            backgroundColor="$ravenCard"
            borderColor="$ravenBorder"
            borderWidth={1}
            borderRadius={RAVEN_RADIUS.input}
            color="$ravenTextPrimary"
            placeholderTextColor={RAVEN_COLORS.textSecondary}
            paddingHorizontal="$4"
          />

          <Input
            size="$5"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            backgroundColor="$ravenCard"
            borderColor="$ravenBorder"
            borderWidth={1}
            borderRadius={RAVEN_RADIUS.input}
            color="$ravenTextPrimary"
            placeholderTextColor={RAVEN_COLORS.textSecondary}
            paddingHorizontal="$4"
          />

          {/* Continue Button */}
          <Button
            size="$5"
            height={50}
            backgroundColor="$ravenCard"
            borderRadius={RAVEN_RADIUS.button}
            marginTop="$4"
            onPress={handleLogin}
            pressStyle={{
              backgroundColor: '$ravenBorder',
            }}
          >
            <Text color="$ravenTextPrimary" fontWeight="600" fontSize={16}>
              Continue
            </Text>
          </Button>
        </YStack>

        {/* OR Divider */}
        <XStack alignItems="center" marginVertical="$6">
          <YStack flex={1} height={1} backgroundColor="$ravenBorder" />
          <Text color="$ravenTextSecondary" marginHorizontal="$4" fontSize={14}>
            OR
          </Text>
          <YStack flex={1} height={1} backgroundColor="$ravenBorder" />
        </XStack>

        {/* Social Login */}
        <Text color="$ravenTextSecondary" textAlign="center" marginBottom="$4">
          continue with
        </Text>
        
        <XStack justifyContent="center" space="$6">
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Apple login')}
          >
            <Text fontSize={28}></Text>
          </Button>
          
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Meta login')}
          >
            <Text fontSize={28}>Ⓜ️</Text>
          </Button>
          
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Google login')}
          >
            <Text fontSize={28}>G</Text>
          </Button>
        </XStack>

        {/* Sign Up Link */}
        <XStack justifyContent="center" marginTop="$8">
          <Text color="$ravenTextSecondary" fontSize={14}>
            Don't have an account yet?{' '}
          </Text>
          <Button chromeless padding={0} onPress={handleSignUp}>
            <Text color="$ravenTextPrimary" fontWeight="600" fontSize={14} textDecorationLine="underline">
              Sign up
            </Text>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
};
