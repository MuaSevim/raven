import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { YStack, Text, Button, Input, Spinner } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { AuthStackParamList } from '../navigation';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp, loading, error } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegister = async () => {
    setValidationError(null);
    
    if (!displayName || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signUp(email, password, displayName);
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const displayError = validationError || error;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_COLORS.background }} edges={['bottom']}>
      <YStack flex={1} padding="$6">
        {/* Header */}
        <YStack marginBottom="$6">
          <Text
            fontSize={14}
            color="$ravenTextSecondary"
            letterSpacing={1}
          >
            JOIN THE NETWORK
          </Text>
        </YStack>

        {/* Registration Form */}
        <YStack space="$4" width="100%">
          <YStack space="$2">
            <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
              DISPLAY NAME
            </Text>
            <Input
              size="$5"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
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
              placeholder="Create a password"
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

          <YStack space="$2">
            <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
              CONFIRM PASSWORD
            </Text>
            <Input
              size="$5"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
          {displayError && (
            <Text color="$ravenError" fontSize={14} textAlign="center">
              {displayError}
            </Text>
          )}

          {/* Register Button */}
          <Button
            size="$5"
            height={50}
            backgroundColor="$ravenPrimary"
            borderRadius={RAVEN_RADIUS.button}
            marginTop="$4"
            onPress={handleRegister}
            disabled={loading}
            pressStyle={{
              backgroundColor: RAVEN_COLORS.primaryAccentDark,
            }}
          >
            {loading ? (
              <Spinner color="$ravenTextPrimary" />
            ) : (
              <Text color="$ravenTextPrimary" fontWeight="600" fontSize={16}>
                CREATE ACCOUNT
              </Text>
            )}
          </Button>
        </YStack>

        {/* Terms */}
        <YStack marginTop="$6" alignItems="center">
          <Text color="$ravenTextSecondary" fontSize={12} textAlign="center">
            By creating an account, you agree to our
          </Text>
          <Text color="$ravenPrimary" fontSize={12} marginTop="$1">
            Terms of Service & Privacy Policy
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
