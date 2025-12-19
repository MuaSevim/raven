import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { XStack } from 'tamagui';
import { RAVEN_LIGHT } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export type StepIndicatorVariant = 'dots' | 'progress';

export interface StepIndicatorProps {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Visual variant */
  variant?: StepIndicatorVariant;
  /** Active color */
  activeColor?: string;
  /** Inactive color */
  inactiveColor?: string;
  /** Dot size (for dots variant) */
  dotSize?: number;
  /** Gap between dots */
  gap?: number;
  /** Progress bar height (for progress variant) */
  barHeight?: number;
}

/**
 * StepIndicator - Visual indicator for multi-step forms
 * 
 * @example
 * // Dots variant (default)
 * <StepIndicator currentStep={2} totalSteps={5} />
 * 
 * @example
 * // Progress bar variant
 * <StepIndicator currentStep={2} totalSteps={5} variant="progress" />
 */
export const StepIndicator = memo<StepIndicatorProps>(({
  currentStep,
  totalSteps,
  variant = 'dots',
  activeColor = RAVEN_LIGHT.primaryText,
  inactiveColor = RAVEN_LIGHT.divider,
  dotSize = 8,
  gap = 8,
  barHeight = 4,
}) => {
  if (variant === 'progress') {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <View style={[styles.progressContainer, { height: barHeight }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: activeColor,
              height: barHeight,
            },
          ]}
        />
      </View>
    );
  }

  // Dots variant
  return (
    <XStack justifyContent="center" gap={gap}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: index + 1 <= currentStep ? activeColor : inactiveColor,
            },
          ]}
        />
      ))}
    </XStack>
  );
});

StepIndicator.displayName = 'StepIndicator';

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  dot: {},
  progressContainer: {
    width: '100%',
    backgroundColor: RAVEN_LIGHT.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 2,
  },
});
