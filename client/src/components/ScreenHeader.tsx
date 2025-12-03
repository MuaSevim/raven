import React from 'react';
import { XStack, Text } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { RAVEN_LIGHT, RAVEN_TYPOGRAPHY } from '../config/theme.config';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

/**
 * ScreenHeader - Consistent header for all screens
 * Includes back button, title, and optional step indicator
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  currentStep,
  totalSteps,
}) => (
  <>
    {/* Header Row */}
    <XStack
      height={56}
      alignItems="center"
      justifyContent="center"
      position="relative"
      width="100%"
    >
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            left: 0,
            padding: 8,
          }}
        >
          <Text fontSize={24} color={RAVEN_LIGHT.primaryText}>
            ←
          </Text>
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text
        fontSize={RAVEN_TYPOGRAPHY.lg}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        {title}
      </Text>
    </XStack>

    {/* Step Indicator */}
    {currentStep !== undefined && totalSteps !== undefined && (
      <XStack justifyContent="center" space="$2" marginTop="$2" marginBottom="$4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <XStack
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
    )}
  </>
);
