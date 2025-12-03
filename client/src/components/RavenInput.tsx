import React from 'react';
import { Input, YStack, Text } from 'tamagui';
import {
  RAVEN_LIGHT,
  RAVEN_RADIUS,
  RAVEN_DIMENSIONS,
  RAVEN_TYPOGRAPHY,
} from '../config/theme.config';

interface RavenInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
  maxLength?: number;
}

/**
 * RavenInput - Styled input field for the Raven Light theme
 * Light gray background, no border, rounded corners
 */
export const RavenInput: React.FC<RavenInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  maxLength,
}) => (
  <YStack width="100%">
    {label && (
      <Text
        fontSize={RAVEN_TYPOGRAPHY.sm}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginBottom="$2"
      >
        {label}
      </Text>
    )}
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      editable={editable}
      maxLength={maxLength}
      backgroundColor={RAVEN_LIGHT.inputBackground}
      borderWidth={0}
      borderRadius={RAVEN_RADIUS.input}
      color={RAVEN_LIGHT.primaryText}
      placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
      paddingHorizontal="$4"
      height={RAVEN_DIMENSIONS.inputHeight}
      fontSize={RAVEN_TYPOGRAPHY.md}
    />
  </YStack>
);
