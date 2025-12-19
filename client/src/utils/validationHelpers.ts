/**
 * ============================================
 * VALIDATION HELPERS - Consolidated validation logic
 * ============================================
 * Centralized validation functions to reduce duplication across screens
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  return { valid: true };
};

/**
 * Validate phone number (basic)
 */
export const validatePhoneNumber = (phoneNumber: string): { valid: boolean; error?: string } => {
  const trimmed = phoneNumber.trim();
  if (!trimmed) return { valid: false, error: 'Phone number is required' };
  
  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(trimmed.replace(/\D/g, ''))) {
    return { valid: false, error: 'Invalid phone number' };
  }
  
  return { valid: true };
};

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (day: string, month: string, year: string): { valid: boolean; error?: string } => {
  if (!day || !month || !year) {
    return { valid: false, error: 'Please enter your complete date of birth' };
  }
  
  const birthDate = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  const actualAge = monthDiff < 0 ? age - 1 : age;
  
  if (actualAge < 13) {
    return { valid: false, error: 'You must be at least 13 years old' };
  }
  
  if (birthDate > today) {
    return { valid: false, error: 'Invalid date of birth' };
  }
  
  return { valid: true };
};

/**
 * Validate text field (min/max length)
 */
export const validateTextField = (
  text: string,
  minLength?: number,
  maxLength?: number,
  fieldName: string = 'Field'
): { valid: boolean; error?: string } => {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (minLength && trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (maxLength && trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be no more than ${maxLength} characters` };
  }
  
  return { valid: true };
};

/**
 * Validate selection (ensure value is selected)
 */
export const validateSelection = (value: string | null, fieldName: string = 'Field'): { valid: boolean; error?: string } => {
  if (!value) {
    return { valid: false, error: `Please select a ${fieldName}` };
  }
  return { valid: true };
};
