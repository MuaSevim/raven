import React, { useState } from 'react';
import { YStack, XStack, Text, Button, Input, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

// Import social icons
const ravenLogo = require('../../assets/images/raven-logo-black.png');
const appleIcon = require('../../assets/images/apple-icon.png');
const metaIcon = require('../../assets/images/meta-icon.png');
const googleIcon = require('../../assets/images/google-icon.png');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <YStack flex={1} padding="$6" justifyContent="center">
        {/* Logo / Brand */}
        <YStack alignItems="center" marginBottom="$6">
          {/* Raven Bird Logo */}
          <Image
            source={ravenLogo}
            width={80}
            height={80}
            resizeMode="contain"
            marginBottom="$2"
          />
          
          <Text
            fontSize={32}
            fontWeight="800"
            color="#000000"
            letterSpacing={4}
          >
            RAVEN
          </Text>
          <Text
            fontSize={14}
            color="#666666"
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
          color="#000000"
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
            backgroundColor="#F5F5F5"
            borderColor="#E0E0E0"
            borderWidth={1}
            borderRadius={RAVEN_RADIUS.input}
            color="#000000"
            placeholderTextColor="#999999"
            paddingHorizontal="$4"
            height={56}
          />

          <Input
            size="$5"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            backgroundColor="#F5F5F5"
            borderColor="#E0E0E0"
            borderWidth={1}
            borderRadius={RAVEN_RADIUS.input}
            color="#000000"
            placeholderTextColor="#999999"
            paddingHorizontal="$4"
            height={56}
          />

          {/* Continue Button */}
          <Button
            size="$5"
            height={50}
            backgroundColor="#1A1A1A"
            borderRadius={RAVEN_RADIUS.button}
            marginTop="$4"
            onPress={handleLogin}
            pressStyle={{
              backgroundColor: '#333333',
            }}
          >
            <Text color="#FFFFFF" fontWeight="600" fontSize={16}>
              Continue
            </Text>
          </Button>
        </YStack>

        {/* OR Divider */}
        <XStack alignItems="center" marginVertical="$6">
          <YStack flex={1} height={1} backgroundColor="#E0E0E0" />
          <Text color="#999999" marginHorizontal="$4" fontSize={14}>
            OR
          </Text>
          <YStack flex={1} height={1} backgroundColor="#E0E0E0" />
        </XStack>

        {/* Social Login */}
        <Text color="#666666" textAlign="center" marginBottom="$4">
          continue with
        </Text>
        
        <XStack justifyContent="center" space="$8">
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Apple login')}
            pressStyle={{ opacity: 0.7 }}
          >
            <Image
              source={appleIcon}
              width={32}
              height={32}
              resizeMode="contain"
            />
          </Button>
          
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Meta login')}
            pressStyle={{ opacity: 0.7 }}
          >
            <Image
              source={metaIcon}
              width={32}
              height={32}
              resizeMode="contain"
            />
          </Button>
          
          <Button
            circular
            size="$5"
            backgroundColor="transparent"
            onPress={() => console.log('Google login')}
            pressStyle={{ opacity: 0.7 }}
          >
            <Image
              source={googleIcon}
              width={32}
              height={32}
              resizeMode="contain"
            />
          </Button>
        </XStack>

        {/* Sign Up Link */}
        <XStack justifyContent="center" marginTop="$8">
          <Text color="#666666" fontSize={14}>
            Don't have an account yet?{' '}
          </Text>
          <Button chromeless padding={0} onPress={handleSignUp}>
            <Text color="#000000" fontWeight="600" fontSize={14} textDecorationLine="underline">
              Sign up
            </Text>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
};
