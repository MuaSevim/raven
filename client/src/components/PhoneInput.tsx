import React from 'react';
import { TouchableOpacity, View, TextInput, Alert, StyleSheet } from 'react-native';
import { XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_RADIUS,
} from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface PhoneCountryCode {
  code: string;
  country: string;
  flag?: string;
}

export interface PhoneInputProps {
  /** Label text above the input */
  label?: string;
  /** Current country code value (e.g., '+1') */
  countryCode: string;
  /** Phone number value */
  phoneNumber: string;
  /** Callback when country code changes */
  onCountryCodeChange: (code: string) => void;
  /** Callback when phone number changes */
  onPhoneNumberChange: (number: string) => void;
  /** Placeholder for phone number input */
  placeholder?: string;
  /** Available country codes */
  countryCodes?: PhoneCountryCode[];
  /** Whether the input is disabled */
  disabled?: boolean;
}

// ============================================
// DEFAULT COUNTRY CODES
// ============================================
export const DEFAULT_PHONE_COUNTRY_CODES: PhoneCountryCode[] = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+90', country: 'TR', flag: '🇹🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

/**
 * PhoneInput - Reusable phone input with country code selector
 * Eliminates duplicate phone input implementations across screens
 *
 * @example
 * <PhoneInput
 *   label="Phone Number"
 *   countryCode={formData.phoneCountryCode}
 *   phoneNumber={formData.phoneNumber}
 *   onCountryCodeChange={(code) => updateField('phoneCountryCode', code)}
 *   onPhoneNumberChange={(num) => updateField('phoneNumber', num)}
 * />
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = '(000) 000-0000',
  countryCodes = DEFAULT_PHONE_COUNTRY_CODES,
  disabled = false,
}) => {
  const handleCountryCodePress = () => {
    if (disabled) return;

    Alert.alert(
      'Select Country Code',
      undefined,
      countryCodes.map((item) => ({
        text: `${item.flag || ''} ${item.code} (${item.country})`.trim(),
        onPress: () => onCountryCodeChange(item.code),
      }))
    );
  };

  const selectedCountry = countryCodes.find((c) => c.code === countryCode);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <XStack gap={8}>
        <TouchableOpacity
          style={[styles.countryCodeButton, disabled && styles.disabled]}
          onPress={handleCountryCodePress}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.countryCodeText}>
            {selectedCountry?.flag && `${selectedCountry.flag} `}
            {countryCode}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={RAVEN_LIGHT.secondaryText}
          />
        </TouchableOpacity>

        <View style={styles.phoneInputContainer}>
          <TextInput
            style={[styles.phoneInput, disabled && styles.disabled]}
            placeholder={placeholder}
            placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
            value={phoneNumber}
            onChangeText={onPhoneNumberChange}
            keyboardType="phone-pad"
            editable={!disabled}
          />
        </View>
      </XStack>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  label: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    fontWeight: '500',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 8,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RAVEN_LIGHT.background,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
    minWidth: 100,
  },
  countryCodeText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    backgroundColor: RAVEN_LIGHT.background,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
  },
  disabled: {
    opacity: 0.5,
  },
});
