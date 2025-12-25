/**
 * Utilities - Export all utilities from this index file
 */

// Validation utilities
export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateDateOfBirth,
  validateTextField,
  validateSelection,
} from './validationHelpers';

// Screen helpers (layout, platform-specific, keyboard handling)
export {
  getSafeAreaEdges,
  getKeyboardBehavior,
  getKeyboardVerticalOffset,
  scrollViewContainerStyle,
  screenFlexStyle,
  TOUCH_TARGET_SIZE,
  defaultHitSlop,
  RENDER_OPTIMIZATION,
} from './screenHelpers';

// Theme helpers
export {
  commonStyles,
  getStateColor,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getPressedOpacity,
  getDisabledOpacity,
} from './themeHelpers';

// Data helpers (type-safe conversions)
export {
  parseBoolean,
  parseNumber,
  parseString,
  clamp,
  formatPrice,
  truncateText,
} from './dataHelpers';

// Legacy exports (for backward compatibility)
export {
  isValidEmail,
  validatePassword as legacyValidatePassword,
  isValidPassword,
  validateDOB,
  isValidPhoneNumber,
  isRequired,
  isSelected,
  validateForm,
  hasErrors,
  getFirstError,
} from './validation';

export type {
  PasswordValidationOptions,
  PasswordValidationResult,
  DOBValidationResult,
  ValidationRule,
} from './validation';
