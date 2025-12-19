/**
 * ============================================
 * THEME HELPERS - Centralized theme utilities
 * ============================================
 * Reduce theme value duplication and provide theme-aware utilities
 */

import { RAVEN_LIGHT, RAVEN_TYPOGRAPHY } from '../config/theme.config';

/**
 * Get disabled opacity for components
 */
export const getDisabledOpacity = (): number => 0.5;

/**
 * Get pressed opacity for interactive elements
 */
export const getPressedOpacity = (): number => 0.7;

/**
 * Common style patterns
 */
export const commonStyles = {
  // Button states
  buttonActive: {
    backgroundColor: RAVEN_LIGHT.buttonPrimary,
    opacity: 1,
  },
  buttonPressed: {
    backgroundColor: RAVEN_LIGHT.buttonPrimaryPressed,
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: getDisabledOpacity(),
  },

  // Text states
  textPrimary: {
    color: RAVEN_LIGHT.primaryText,
    fontSize: RAVEN_TYPOGRAPHY.md,
  },
  textSecondary: {
    color: RAVEN_LIGHT.secondaryText,
    fontSize: RAVEN_TYPOGRAPHY.sm,
  },
  textSmall: {
    color: RAVEN_LIGHT.primaryText,
    fontSize: RAVEN_TYPOGRAPHY.xs,
  },

  // Input states
  inputActive: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderColor: RAVEN_LIGHT.primaryText,
  },
  inputInactive: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderColor: RAVEN_LIGHT.border,
  },
  inputDisabled: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    opacity: getDisabledOpacity(),
  },
};

/**
 * Get color variant based on state
 */
export const getStateColor = (
  state: 'primary' | 'success' | 'error' | 'warning' | 'info'
): string => {
  const colorMap: Record<string, string> = {
    primary: RAVEN_LIGHT.buttonPrimary,
    success: RAVEN_LIGHT.success,
    error: RAVEN_LIGHT.error,
    warning: RAVEN_LIGHT.warning,
    info: RAVEN_LIGHT.info,
  };
  return colorMap[state] || RAVEN_LIGHT.primaryText;
};

/**
 * Get responsive font size
 */
export const getResponsiveFontSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): number => {
  return RAVEN_TYPOGRAPHY[size];
};

/**
 * Get responsive spacing
 */
export const getResponsiveSpacing = (
  level: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
): string => {
  const spaceMap: Record<string, string> = {
    xs: '$1',
    sm: '$2',
    md: '$3',
    lg: '$4',
    xl: '$5',
    xxl: '$6',
  };
  return spaceMap[level];
};
