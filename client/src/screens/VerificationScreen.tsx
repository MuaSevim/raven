import React, { useState, useRef } from 'react';
import { TextInput, TouchableOpacity, Alert } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Reusable Components
import { RavenButton } from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type VerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Verification'>;

const CODE_LENGTH = 4;

/**
 * VerificationScreen - 4-digit code verification
 * Simulates email verification during signup
 */
export const VerificationScreen: React.FC = () => {
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  
  // 4-digit code state
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleCodeChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace to go to previous input
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== CODE_LENGTH) {
      Alert.alert('Invalid Code', 'Please enter the complete 4-digit code.');
      return;
    }

    // Simulate verification (any 4-digit code works)
    console.log('=== Verification ===');
    console.log('Code entered:', fullCode);
    console.log('====================');

    // Navigate to Welcome screen
    navigation.replace('Welcome');
  };

  const handleResendCode = () => {
    Alert.alert(
      'Code Resent',
      'A new verification code has been sent to your email.',
      [{ text: 'OK' }]
    );
    // Clear current code
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <YStack
        flex={1}
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        justifyContent="center"
        alignItems="center"
      >
        {/* Title */}
        <Text
          fontSize={RAVEN_TYPOGRAPHY.lg}
          fontWeight={RAVEN_TYPOGRAPHY.semibold}
          color={RAVEN_LIGHT.primaryText}
          marginBottom="$4"
        >
          Verification
        </Text>

        {/* Heading */}
        <Text
          fontSize={RAVEN_TYPOGRAPHY.xxl}
          fontWeight={RAVEN_TYPOGRAPHY.bold}
          color={RAVEN_LIGHT.primaryText}
          textAlign="center"
          marginBottom="$2"
        >
          We sent you a code
        </Text>

        {/* Subtext */}
        <Text
          fontSize={RAVEN_TYPOGRAPHY.sm}
          color={RAVEN_LIGHT.secondaryText}
          textAlign="center"
          marginBottom="$6"
          paddingHorizontal="$4"
        >
          Please enter the 4-digit code sent to your email
        </Text>

        {/* Code Input Boxes */}
        <XStack space="$3" marginBottom="$4">
          {code.map((digit, index) => (
            <YStack
              key={index}
              width={60}
              height={60}
              backgroundColor={RAVEN_LIGHT.inputBackground}
              borderRadius={RAVEN_RADIUS.input}
              justifyContent="center"
              alignItems="center"
            >
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '600',
                  color: RAVEN_LIGHT.primaryText,
                }}
                selectTextOnFocus
              />
            </YStack>
          ))}
        </XStack>

        {/* Resend Code Link */}
        <TouchableOpacity onPress={handleResendCode} activeOpacity={0.7}>
          <Text
            fontSize={RAVEN_TYPOGRAPHY.sm}
            color={RAVEN_LIGHT.secondaryText}
            marginBottom="$6"
          >
            Resend Code
          </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <YStack width="100%">
          <RavenButton onPress={handleVerify}>
            Verify
          </RavenButton>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
