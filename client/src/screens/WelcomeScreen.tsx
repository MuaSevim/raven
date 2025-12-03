import React from 'react';
import { YStack, Text, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
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

// Reusable Components
import { RavenButton } from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

/**
 * WelcomeScreen - Shown after successful login/signup
 * Simple welcome message with option to continue to main app
 */
export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleContinue = () => {
    // In a real app, this would navigate to the main app (tabs, home, etc.)
    console.log('Continue to main app');
    // For now, just log and stay on this screen
    // navigation.navigate('Home'); // When Home screen exists
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <YStack
        flex={1}
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        justifyContent="center"
        alignItems="center"
      >
        {/* Logo */}
        <Image
          source={RAVEN_ASSETS.logo}
          width={RAVEN_DIMENSIONS.logoSize * 1.5}
          height={RAVEN_DIMENSIONS.logoSize * 1.5}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text
          fontSize={RAVEN_TYPOGRAPHY.xxxl}
          fontWeight={RAVEN_TYPOGRAPHY.bold}
          color={RAVEN_LIGHT.primaryText}
          marginTop="$6"
          textAlign="center"
        >
          Welcome to Raven!
        </Text>

        <Text
          fontSize={RAVEN_TYPOGRAPHY.md}
          color={RAVEN_LIGHT.secondaryText}
          marginTop="$3"
          textAlign="center"
          paddingHorizontal="$4"
        >
          You're all set. Start exploring trips and connect with travelers around the world.
        </Text>

        {/* Success Icon */}
        <YStack
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor={RAVEN_LIGHT.success}
          alignItems="center"
          justifyContent="center"
          marginTop="$8"
        >
          <Text fontSize={40} color={RAVEN_LIGHT.buttonPrimaryText}>
            ✓
          </Text>
        </YStack>

        {/* Spacer */}
        <YStack flex={1} minHeight="$8" />

        {/* Action Buttons */}
        <YStack width="100%" space="$3" paddingBottom="$6">
          <RavenButton onPress={handleContinue}>
            Get Started
          </RavenButton>

          <RavenButton variant="outline" onPress={handleLogout}>
            Log Out
          </RavenButton>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
