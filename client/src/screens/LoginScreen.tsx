import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { YStack, XStack, Text, Button, Input, Spinner } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { AuthStackParamList } from '../navigation';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    
    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_COLORS.background }}>
      <YStack flex={1} padding="$6" justifyContent="center">
        {/* Logo / Brand */}
        <YStack alignItems="center" marginBottom="$8">
          <Text
            fontSize={48}
            fontWeight="800"
            color="$ravenTextPrimary"
            letterSpacing={2}
          >
            RAVEN
          </Text>
          <Text
            fontSize={14}
            color="$ravenTextSecondary"
            marginTop="$2"
            letterSpacing={1}
          >
            PEER-TO-PEER LOGISTICS
          </Text>
        </YStack>

        {/* Login Form */}
        <YStack space="$4" width="100%">
          <YStack space="$2">
            <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
              EMAIL
            </Text>
            <Input
              size="$5"
              placeholder="Enter your email"
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
              focusStyle={{
                borderColor: '$ravenPrimary',
              }}
            />
          </YStack>

          <YStack space="$2">
            <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
              PASSWORD
            </Text>
            <Input
              size="$5"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              backgroundColor="$ravenCard"
              borderColor="$ravenBorder"
              borderWidth={1}
              borderRadius={RAVEN_RADIUS.input}
              color="$ravenTextPrimary"
              placeholderTextColor={RAVEN_COLORS.textSecondary}
              focusStyle={{
                borderColor: '$ravenPrimary',
              }}
            />
          </YStack>

          {/* Error Message */}
          {error && (
            <Text color="$ravenError" fontSize={14} textAlign="center">
              {error}
            </Text>
          )}

          {/* Sign In Button */}
          <Button
            size="$5"
            height={50}
            backgroundColor="$ravenPrimary"
            borderRadius={RAVEN_RADIUS.button}
            marginTop="$4"
            onPress={handleLogin}
            disabled={loading || !email || !password}
            pressStyle={{
              backgroundColor: RAVEN_COLORS.primaryAccentDark,
            }}
          >
            {loading ? (
              <Spinner color="$ravenTextPrimary" />
            ) : (
              <Text color="$ravenTextPrimary" fontWeight="600" fontSize={16}>
                SIGN IN
              </Text>
            )}
          </Button>

          {/* Forgot Password */}
          <XStack justifyContent="center" marginTop="$2">
            <Button
              chromeless
              onPress={() => {}}
            >
              <Text color="$ravenTextSecondary" fontSize={14}>
                Forgot Password?
              </Text>
            </Button>
          </XStack>
        </YStack>

        {/* Create Account */}
        <YStack marginTop="$8" alignItems="center">
          <Text color="$ravenTextSecondary" fontSize={14}>
            Don't have an account?
          </Text>
          <Button
            chromeless
            marginTop="$2"
            onPress={handleCreateAccount}
          >
            <Text color="$ravenPrimary" fontWeight="600" fontSize={16}>
              CREATE ACCOUNT
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
