import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { YStack, Text } from 'tamagui';
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
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
  maxLength?: number;
}

/**
 * RavenInput - Styled input field for the Raven Light theme
 * Uses React Native TextInput to avoid Tamagui iOS boolean type issues
 * Optimized with React.memo for performance
 */
export const RavenInput: React.FC<RavenInputProps> = React.memo(({
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
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={Boolean(secureTextEntry)}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={Boolean(autoCorrect)}
        autoComplete="off"
        spellCheck={false}
        editable={Boolean(editable)}
        maxLength={maxLength}
        placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
        style={styles.input}
      />
    </View>
  </YStack>
));

RavenInput.displayName = 'RavenInput';

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.input,
    height: RAVEN_DIMENSIONS.inputHeight,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
  },
});
