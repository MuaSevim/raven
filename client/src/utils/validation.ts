/**
 * Validation Utilities - Reusable validation functions
 * Eliminates duplicate validation logic across screens
 */

// ============================================
// EMAIL VALIDATION
// ============================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

// ============================================
// PASSWORD VALIDATION
// ============================================
export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates password against configurable rules
 * @example
 * validatePassword('mypass123', { minLength: 8, requireNumber: true })
 */
export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = {}
): PasswordValidationResult => {
  const {
    minLength = 8,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecial = false,
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Simple password length validation
 */
export const isValidPassword = (password: string, minLength = 8): boolean => {
  return password.length >= minLength;
};

// ============================================
// DATE OF BIRTH VALIDATION
// ============================================
export interface DOBValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates date of birth components
 * @param day - Day (1-31)
 * @param month - Month (1-12)
 * @param year - Full year (e.g., 1990)
 * @param minAge - Minimum age required (default: 13)
 */
export const validateDOB = (
  day: string,
  month: string,
  year: string,
  minAge = 13
): DOBValidationResult => {
  // Check if all fields are provided
  if (!day || !month || !year) {
    return { valid: false, error: 'Please enter your full date of birth' };
  }

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Validate day
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
    return { valid: false, error: 'Invalid day' };
  }

  // Validate month
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return { valid: false, error: 'Invalid month' };
  }

  // Validate year
  const currentYear = new Date().getFullYear();
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
    return { valid: false, error: 'Invalid year' };
  }

  // Check minimum age
  const birthDate = new Date(yearNum, monthNum - 1, dayNum);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { valid: false, error: `You must be at least ${minAge} years old` };
  }

  // Validate date is real (e.g., no Feb 30)
  if (birthDate.getMonth() !== monthNum - 1 || birthDate.getDate() !== dayNum) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true };
};

// ============================================
// PHONE NUMBER VALIDATION
// ============================================
/**
 * Validates phone number (basic length check)
 * @param phoneNumber - Phone number without country code
 * @param minLength - Minimum digits (default: 7)
 * @param maxLength - Maximum digits (default: 15)
 */
export const isValidPhoneNumber = (
  phoneNumber: string,
  minLength = 7,
  maxLength = 15
): boolean => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length >= minLength && digitsOnly.length <= maxLength;
};

// ============================================
// REQUIRED FIELD VALIDATION
// ============================================
/**
 * Checks if a string field is not empty
 */
export const isRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

/**
 * Checks if a value is selected (for dropdowns)
 */
export const isSelected = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.length > 0;
};

// ============================================
// FORM VALIDATION HELPER
// ============================================
export type ValidationRule<T> = {
  field: keyof T;
  validate: (value: T[keyof T], formData: T) => boolean;
  message: string;
};

/**
 * Validates form data against a set of rules
 * @returns Object with field names as keys and error messages as values
 */
export const validateForm = <T extends Record<string, unknown>>(
  formData: T,
  rules: ValidationRule<T>[]
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const rule of rules) {
    const value = formData[rule.field];
    if (!rule.validate(value, formData)) {
      errors[rule.field] = rule.message;
    }
  }

  return errors;
};

/**
 * Checks if validation result has any errors
 */
export const hasErrors = <T>(errors: Partial<Record<keyof T, string>>): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Gets the first error message from validation result
 */
export const getFirstError = <T>(errors: Partial<Record<keyof T, string>>): string | null => {
  const values = Object.values(errors);
  return values.length > 0 ? (values[0] as string) : null;
};
