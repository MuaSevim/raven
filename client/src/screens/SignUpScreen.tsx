import React, { useState, useMemo, useEffect } from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  View,
  ScrollView,
} from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Components
import { RavenInput, RavenButton, SearchableSelect, SelectOption, DatePickerField } from '../components';

// Services
import { LocationService } from '../services/LocationService';

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
  countryCode: string;
  countryName: string;
  cityId: string;
  cityName: string;
  // Step 3: Security
  email: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  day?: string;
  month?: string;
  year?: string;
  country?: string;
  city?: string;
  email?: string;
  password?: string;
}

const TOTAL_STEPS = 3;

/**
 * SignUpScreen - Multi-step registration flow with validation
 * Step 1: Identity (First Name, Last Name, DOB)
 * Step 2: Location (Country, City) with SearchableSelect
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
    countryCode: '',
    countryName: '',
    cityId: '',
    cityName: '',
    email: '',
    password: '',
  });

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Cities loading state
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);

  // ============================================
  // LOCATION OPTIONS
  // ============================================
  const countryOptions = useMemo((): SelectOption[] => {
    return LocationService.getAllCountries().map((c) => ({
      id: c.code,
      label: c.name,
      icon: c.flag,
    }));
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!formData.countryCode || !formData.countryName) {
      setCityOptions([]);
      return;
    }

    setCitiesLoading(true);
    LocationService.getCitiesByCountryAsync(formData.countryCode)
      .then((cities) => {
        setCityOptions(
          cities.map((c) => ({
            id: c.id,
            label: c.name,
          }))
        );
      })
      .catch((err) => {
        console.error('Failed to load cities:', err);
        setCityOptions([]);
      })
      .finally(() => {
        setCitiesLoading(false);
      });
  }, [formData.countryCode, formData.countryName]);

  // ============================================
  // HELPERS
  // ============================================
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateDOB = (): { valid: boolean; error?: string } => {
    const day = parseInt(formData.day, 10);
    const month = parseInt(formData.month, 10);
    const year = parseInt(formData.year, 10);

    if (!formData.day || !formData.month || !formData.year) {
      return { valid: false, error: 'Please enter your full date of birth' };
    }

    if (isNaN(day) || day < 1 || day > 31) {
      return { valid: false, error: 'Invalid day' };
    }

    if (isNaN(month) || month < 1 || month > 12) {
      return { valid: false, error: 'Invalid month' };
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear - 13) {
      return { valid: false, error: 'You must be at least 13 years old' };
    }

    return { valid: true };
  };

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        const dobValidation = validateDOB();
        if (!dobValidation.valid) {
          newErrors.day = dobValidation.error;
        }
        break;

      case 2:
        if (!formData.countryCode) {
          newErrors.country = 'Please select a country';
        }
        if (!formData.cityId) {
          newErrors.city = 'Please select a city';
        }
        break;

      case 3:
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password.trim()) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        break;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      Alert.alert('Validation Error', firstError);
      return false;
    }

    return true;
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    console.log('=== Creating Account ===');
    console.log('Name:', `${formData.firstName} ${formData.lastName}`);
    console.log('DOB:', `${formData.day}/${formData.month}/${formData.year}`);
    console.log('Location:', `${formData.cityName}, ${formData.countryName}`);
    console.log('Email:', formData.email);
    console.log('========================');

    navigation.navigate('Verification');
  };

  const handleCountrySelect = (option: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: option.id,
      countryName: option.label,
      cityId: '',
      cityName: '',
    }));
    setErrors((prev) => ({ ...prev, country: undefined }));
  };

  const handleCitySelect = (option: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      cityId: option.id,
      cityName: option.label,
    }));
    setErrors((prev) => ({ ...prev, city: undefined }));
  };

  // ============================================
  // STEP INDICATOR
  // ============================================
  const renderStepIndicator = () => (
    <XStack justifyContent="center" gap={8} marginTop="$2">
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
    <YStack gap={16} width="100%">
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
      {errors.firstName && (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      )}

      <RavenInput
        label="Last Name"
        placeholder="Carter"
        value={formData.lastName}
        onChangeText={(v: string) => updateField('lastName', v)}
        autoCapitalize="words"
      />
      {errors.lastName && (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      )}

      <DatePickerField
        label="Date of Birth"
        day={formData.day}
        month={formData.month}
        year={formData.year}
        onDayChange={(v) => updateField('day', v)}
        onMonthChange={(v) => updateField('month', v)}
        onYearChange={(v) => updateField('year', v)}
        error={errors.day}
      />
    </YStack>
  );

  const renderStep2 = () => (
    <YStack gap={16} width="100%">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.xl}
        fontWeight={RAVEN_TYPOGRAPHY.bold}
        color={RAVEN_LIGHT.primaryText}
        marginBottom="$2"
      >
        Where are you based?
      </Text>

      <SearchableSelect
        label="Country"
        placeholder="Select your country"
        value={formData.countryName}
        options={countryOptions}
        onSelect={handleCountrySelect}
      />
      {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

      <SearchableSelect
        label="City"
        placeholder={citiesLoading ? "Loading cities..." : "Select your city"}
        value={formData.cityName}
        options={cityOptions}
        onSelect={handleCitySelect}
        disabled={!formData.countryCode || citiesLoading}
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
    </YStack>
  );

  const renderStep3 = () => (
    <YStack gap={16} width="100%">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.xl}
        fontWeight={RAVEN_TYPOGRAPHY.bold}
        color={RAVEN_LIGHT.primaryText}
        marginBottom="$2"
      >
        Secure your account
      </Text>

      <RavenInput
        label="Email"
        placeholder="you@example.com"
        value={formData.email}
        onChangeText={(v: string) => updateField('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <RavenInput
        label="Password"
        placeholder="At least 8 characters"
        value={formData.password}
        onChangeText={(v: string) => updateField('password', v)}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} paddingHorizontal={RAVEN_SPACING.screenPadding}>
          {/* Header */}
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$4"
            position="relative"
          >
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={RAVEN_LIGHT.primaryText}
              />
            </TouchableOpacity>

            <Text
              fontSize={RAVEN_TYPOGRAPHY.lg}
              fontWeight={RAVEN_TYPOGRAPHY.semibold}
              color={RAVEN_LIGHT.primaryText}
            >
              {getHeaderTitle()}
            </Text>
          </XStack>

          {renderStepIndicator()}

          {/* Step Content */}
          <YStack flex={1} paddingTop="$6">
            {renderCurrentStep()}
          </YStack>

          {/* Bottom Section */}
          <YStack paddingBottom="$6">
            <RavenButton onPress={handleNext}>
              {currentStep === TOTAL_STEPS ? 'Create Account' : 'Next'}
            </RavenButton>

            {currentStep === TOTAL_STEPS && (
              <XStack justifyContent="center" marginTop="$4">
                <Text
                  color={RAVEN_LIGHT.secondaryText}
                  fontSize={RAVEN_TYPOGRAPHY.sm}
                >
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text
                    color={RAVEN_LIGHT.info}
                    fontWeight={RAVEN_TYPOGRAPHY.medium}
                    fontSize={RAVEN_TYPOGRAPHY.sm}
                  >
                    Sign In
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

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RAVEN_LIGHT.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  errorText: {
    color: RAVEN_LIGHT.error,
    fontSize: RAVEN_TYPOGRAPHY.xs,
    marginTop: -8,
  },
});
