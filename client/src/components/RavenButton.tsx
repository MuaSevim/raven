import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  RAVEN_LIGHT,
  RAVEN_RADIUS,
  RAVEN_DIMENSIONS,
  RAVEN_TYPOGRAPHY,
} from '../config/theme.config';

interface RavenButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

/**
 * RavenButton - Primary action button for the Raven Light theme
 * Dark background (#1A1A1A), white text, rounded corners
 * Uses React Native TouchableOpacity to avoid Tamagui iOS boolean type issues
 * Optimized with useMemo for color calculations
 */
export const RavenButton: React.FC<RavenButtonProps> = React.memo(({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
}) => {
  const buttonStyle = useMemo((): ViewStyle => {
    let backgroundColor: string;
    let borderWidth = 0;
    let borderColor = 'transparent';

    if (disabled) {
      backgroundColor = '#CCCCCC';
    } else {
      switch (variant) {
        case 'primary':
          backgroundColor = RAVEN_LIGHT.buttonPrimary;
          break;
        case 'secondary':
          backgroundColor = RAVEN_LIGHT.inputBackground;
          break;
        case 'outline':
          backgroundColor = 'transparent';
          borderWidth = 1;
          borderColor = RAVEN_LIGHT.border;
          break;
        default:
          backgroundColor = RAVEN_LIGHT.buttonPrimary;
      }
    }

    return {
      height: RAVEN_DIMENSIONS.buttonHeight,
      backgroundColor,
      borderRadius: RAVEN_RADIUS.button,
      borderWidth,
      borderColor,
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
    };
  }, [disabled, variant, fullWidth]);

  const textStyle = useMemo((): TextStyle => {
    let color: string;
    if (disabled) {
      color = '#888888';
    } else {
      switch (variant) {
        case 'primary':
          color = RAVEN_LIGHT.buttonPrimaryText;
          break;
        case 'secondary':
        case 'outline':
          color = RAVEN_LIGHT.primaryText;
          break;
        default:
          color = RAVEN_LIGHT.buttonPrimaryText;
      }
    }

    return {
      color,
      fontWeight: RAVEN_TYPOGRAPHY.semibold as TextStyle['fontWeight'],
      fontSize: RAVEN_TYPOGRAPHY.md,
    };
  }, [disabled, variant]);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={Boolean(disabled)}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
    >
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
});

RavenButton.displayName = 'RavenButton';

