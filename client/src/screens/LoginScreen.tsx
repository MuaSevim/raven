import React, { useState } from 'react';
import { Alert, ScrollView, Image, View, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_ASSETS,
  RAVEN_TYPOGRAPHY,
  RAVEN_DIMENSIONS,
  RAVEN_SPACING,
} from '../config/theme.config';

// Constants
import { DUMMY_AUTH } from '../config/constants';

// Reusable Components
import {
  SocialButton,
  RavenInput,
  RavenButton,
} from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/**
 * LoginScreen - Main authentication screen
 * Uses Raven Light Theme design system
 */
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ============================================
  // HANDLERS
  // ============================================
  const handleLogin = () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // Check against dummy credentials
    if (email === DUMMY_AUTH.email && password === DUMMY_AUTH.password) {
      // Success - Navigate to Welcome
      navigation.replace('Welcome');
    } else {
      // Failed - Show error
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.'
      );
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login pressed`);
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          flex={1}
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingTop="$8"
          paddingBottom="$4"
        >
          {/* ========== HEADER SECTION ========== */}
          <YStack alignItems="center" marginBottom="$6">
            {/* Raven Logo */}
            <Image
              source={RAVEN_ASSETS.logo}
              style={{
                width: RAVEN_DIMENSIONS.logoSize,
                height: RAVEN_DIMENSIONS.logoSize,
              }}
              resizeMode="contain"
            />

            {/* Brand Name */}
            <Text
              fontSize={RAVEN_TYPOGRAPHY.xxl}
              fontWeight={RAVEN_TYPOGRAPHY.bold}
              color={RAVEN_LIGHT.primaryText}
              letterSpacing={3}
              marginTop="$2"
            >
              RAVEN
            </Text>

            {/* Tagline */}
            <Text
              fontSize={RAVEN_TYPOGRAPHY.md}
              color={RAVEN_LIGHT.secondaryText}
              marginTop="$1"
              fontStyle="italic"
            >
              "Travel for free"
            </Text>
          </YStack>

          {/* ========== SIGN IN TITLE ========== */}
          <Text
            fontSize={RAVEN_TYPOGRAPHY.xl}
            fontWeight={RAVEN_TYPOGRAPHY.semibold}
            color={RAVEN_LIGHT.primaryText}
            textAlign="center"
            marginBottom="$6"
          >
            Sign In
          </Text>

          {/* ========== EMAIL/PASSWORD FORM ========== */}
          <YStack space="$3" width="100%">
            <RavenInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <RavenInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Continue Button */}
            <YStack marginTop="$4">
              <RavenButton onPress={handleLogin}>
                Continue
              </RavenButton>
            </YStack>
          </YStack>

          {/* ========== OR DIVIDER ========== */}
          <XStack
            alignItems="center"
            justifyContent="center"
            marginVertical="$5"
            width="100%"
          >
            <View style={{ flex: 1, height: 1, backgroundColor: RAVEN_LIGHT.divider }} />
            <Text
              color={RAVEN_LIGHT.secondaryText}
              fontSize={RAVEN_TYPOGRAPHY.sm}
              paddingHorizontal="$3"
            >
              OR
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: RAVEN_LIGHT.divider }} />
          </XStack>

          {/* ========== SOCIAL LOGIN SECTION ========== */}
          <YStack alignItems="center">
            <Text
              color={RAVEN_LIGHT.secondaryText}
              fontSize={RAVEN_TYPOGRAPHY.sm}
              marginBottom="$4"
            >
              continue with
            </Text>

            <XStack justifyContent="center" space="$6">
              <SocialButton
                icon={RAVEN_ASSETS.appleIcon}
                onPress={() => handleSocialLogin('Apple')}
              />
              <SocialButton
                icon={RAVEN_ASSETS.metaIcon}
                onPress={() => handleSocialLogin('Meta')}
              />
              <SocialButton
                icon={RAVEN_ASSETS.googleIcon}
                onPress={() => handleSocialLogin('Google')}
              />
            </XStack>
          </YStack>

          {/* ========== SPACER ========== */}
          <YStack flex={1} minHeight="$4" />

          {/* ========== SIGN UP LINK ========== */}
          <XStack justifyContent="center" paddingBottom="$4">
            <Text color={RAVEN_LIGHT.secondaryText} fontSize={RAVEN_TYPOGRAPHY.sm}>
              Don't have an account yet?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
              <Text
                color={RAVEN_LIGHT.primaryText}
                fontWeight={RAVEN_TYPOGRAPHY.semibold}
                fontSize={RAVEN_TYPOGRAPHY.sm}
                textDecorationLine="underline"
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};
