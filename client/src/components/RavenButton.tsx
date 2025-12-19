import React, { useCallback, useMemo } from 'react';
import { Button, Text } from 'tamagui';
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
 * Optimized with useMemo for color calculations
 */
export const RavenButton: React.FC<RavenButtonProps> = React.memo(({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
}) => {
  const getBackgroundColor = useCallback(() => {
    if (disabled) return '#CCCCCC';
    switch (variant) {
      case 'primary':
        return RAVEN_LIGHT.buttonPrimary;
      case 'secondary':
        return RAVEN_LIGHT.inputBackground;
      case 'outline':
        return 'transparent';
      default:
        return RAVEN_LIGHT.buttonPrimary;
    }
  }, [disabled, variant]);

  const getTextColor = useCallback(() => {
    if (disabled) return '#888888';
    switch (variant) {
      case 'primary':
        return RAVEN_LIGHT.buttonPrimaryText;
      case 'secondary':
      case 'outline':
        return RAVEN_LIGHT.primaryText;
      default:
        return RAVEN_LIGHT.buttonPrimaryText;
    }
  }, [disabled, variant]);

  const pressStyle = useMemo(() => ({
    backgroundColor: disabled ? '#CCCCCC' : RAVEN_LIGHT.buttonPrimaryPressed,
    opacity: 0.9,
  }), [disabled]);

  return (
    <Button
      height={RAVEN_DIMENSIONS.buttonHeight}
      backgroundColor={getBackgroundColor()}
      borderRadius={RAVEN_RADIUS.button}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor={variant === 'outline' ? RAVEN_LIGHT.border : 'transparent'}
      onPress={onPress}
      disabled={disabled}
      width={fullWidth ? '100%' : 'auto'}
      pressStyle={pressStyle}
    >
      <Text
        color={getTextColor()}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        fontSize={RAVEN_TYPOGRAPHY.md}
      >
        {children}
      </Text>
    </Button>
  );
});

RavenButton.displayName = 'RavenButton';

