import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
} from '../config/theme.config';

// Reusable Components
import { RavenInput, RavenButton } from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

// ============================================
// TYPES
// ============================================
interface FormData {
  // Step 1: Identity
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  // Step 2: Location
  country: string;
  city: string;
  // Step 3: Security
  email: string;
  password: string;
}

const TOTAL_STEPS = 3;

/**
 * SignUpScreen - Multi-step registration flow
 * Step 1: Identity (First Name, Last Name, DOB)
 * Step 2: Location (Country, City)
 * Step 3: Security (Email, Password)
 */
export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  // Current step (1-3)
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    country: '',
    city: '',
    email: '',
    password: '',
  });

  // ============================================
  // HELPERS
  // ============================================
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getHeaderTitle = (): string => {
    switch (currentStep) {
      case 1:
        return 'Raven';
      case 2:
      case 3:
        return 'Sign up';
      default:
        return 'Sign up';
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          Alert.alert('Required Fields', 'Please enter your first and last name.');
          return false;
        }
        return true;

      case 2:
        if (!formData.country.trim() || !formData.city.trim()) {
          Alert.alert('Required Fields', 'Please enter your country and city.');
          return false;
        }
        return true;

      case 3:
        if (!formData.email.trim()) {
          Alert.alert('Required Field', 'Please enter your email address.');
          return false;
        }
        if (!formData.password.trim()) {
          Alert.alert('Required Field', 'Please enter a password.');
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    // Log account data (in production, this would call an API)
    console.log('=== Creating Account ===');
    console.log('Name:', `${formData.firstName} ${formData.lastName}`);
    console.log('DOB:', `${formData.day}/${formData.month}/${formData.year}`);
    console.log('Location:', `${formData.city}, ${formData.country}`);
    console.log('Email:', formData.email);
    console.log('========================');

    // Navigate to Verification screen
    navigation.navigate('Verification');
  };

  const handleRegister = () => {
    // Go back to step 1 to start over
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: '',
      country: '',
      city: '',
      email: '',
      password: '',
    });
  };

  // ============================================
  // STEP INDICATOR
  // ============================================
  const renderStepIndicator = () => (
    <XStack justifyContent="center" space="$2" marginTop="$2">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => (
        <YStack
          key={index}
          width={8}
          height={8}
          borderRadius={4}
          backgroundColor={
            index + 1 === currentStep
              ? RAVEN_LIGHT.primaryText
              : RAVEN_LIGHT.divider
          }
        />
      ))}
    </XStack>
  );

  // ============================================
  // RENDER STEPS
  // ============================================
  const renderStep1 = () => (
    <YStack space="$4" width="100%">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.xl}
        fontWeight={RAVEN_TYPOGRAPHY.bold}
        color={RAVEN_LIGHT.primaryText}
        marginBottom="$2"
      >
        Let's get to know you.
      </Text>

      <RavenInput
        label="First Name"
        placeholder="Liam"
        value={formData.firstName}
        onChangeText={(v: string) => updateField('firstName', v)}
        autoCapitalize="words"
      />

      <RavenInput
        label="Last Name"
        placeholder="Carter"
        value={formData.lastName}
        onChangeText={(v: string) => updateField('lastName', v)}
        autoCapitalize="words"
      />

      {/* Date of Birth Row */}
      <XStack space="$3">
        <YStack flex={1}>
          <RavenInput
            label="Day"
            placeholder="DD"
            value={formData.day}
            onChangeText={(v: string) => updateField('day', v)}
            keyboardType="number-pad"
            maxLength={2}
          />
        </YStack>
        <YStack flex={1}>
          <RavenInput
            label="Month"
            placeholder="MM"
            value={formData.month}
            onChangeText={(v: string) => updateField('month', v)}
            keyboardType="number-pad"
            maxLength={2}
          />
        </YStack>
      </XStack>

      <RavenInput
        label="Year"
        placeholder="YYYY"
        value={formData.year}
        onChangeText={(v: string) => updateField('year', v)}
        keyboardType="number-pad"
        maxLength={4}
      />
    </YStack>
  );

  const renderStep2 = () => (
    <YStack space="$4" width="100%">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.xl}
        fontWeight={RAVEN_TYPOGRAPHY.bold}
        color={RAVEN_LIGHT.primaryText}
        marginBottom="$2"
      >
        Where are you based?
      </Text>

      <RavenInput
        placeholder="Select"
        value={formData.country}
        onChangeText={(v: string) => updateField('country', v)}
      />

      <RavenInput
        placeholder="Select"
        value={formData.city}
        onChangeText={(v: string) => updateField('city', v)}
      />
    </YStack>
  );

  const renderStep3 = () => (
    <YStack space="$4" width="100%">
      <RavenInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(v: string) => updateField('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <RavenInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(v: string) => updateField('password', v)}
        secureTextEntry
      />
    </YStack>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} paddingHorizontal={RAVEN_SPACING.screenPadding}>
          {/* ========== HEADER ========== */}
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$4"
            position="relative"
          >
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleBack}
              style={{ position: 'absolute', left: 0, padding: 4 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={RAVEN_LIGHT.primaryText} />
            </TouchableOpacity>

            {/* Title */}
            <Text
              fontSize={RAVEN_TYPOGRAPHY.lg}
              fontWeight={RAVEN_TYPOGRAPHY.semibold}
              color={RAVEN_LIGHT.primaryText}
            >
              {getHeaderTitle()}
            </Text>
          </XStack>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* ========== STEP CONTENT ========== */}
          <YStack flex={1} paddingTop="$6">
            {renderCurrentStep()}
          </YStack>

          {/* ========== BOTTOM SECTION ========== */}
          <YStack paddingBottom="$6">
            <RavenButton onPress={handleNext}>
              {currentStep === TOTAL_STEPS ? 'Sign In' : 'Next'}
            </RavenButton>

            {/* Register Link (only on Step 3) */}
            {currentStep === TOTAL_STEPS && (
              <XStack justifyContent="center" marginTop="$4">
                <Text color={RAVEN_LIGHT.secondaryText} fontSize={RAVEN_TYPOGRAPHY.sm}>
                  No account?{' '}
                </Text>
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
                  <Text
                    color={RAVEN_LIGHT.info}
                    fontWeight={RAVEN_TYPOGRAPHY.medium}
                    fontSize={RAVEN_TYPOGRAPHY.sm}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </XStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};
