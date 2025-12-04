/**
 * ============================================
 * RAVEN DESIGN SYSTEM - LIGHT THEME
 * ============================================
 * Single source of truth for all design tokens.
 * Import this file in any component that needs styling.
 */

// ============================================
// COLOR PALETTE
// ============================================
export const RAVEN_LIGHT = {
  // Core Colors
  background: '#FFFFFF',
  primaryText: '#000000',
  secondaryText: '#A0A0A0',
  
  // Input Styling
  inputBackground: '#F5F5F5',
  inputPlaceholder: '#A0A0A0',
  inputBorder: 'transparent',
  
  // Button Styling
  buttonPrimary: '#1A1A1A',
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryPressed: '#333333',
  
  // Dividers & Borders
  divider: '#E5E5E5',
  border: '#E0E0E0',
  
  // Status Colors
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

// ============================================
// SPACING SCALE
// ============================================
export const RAVEN_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: '$5',
} as const;

// ============================================
// BORDER RADIUS
// ============================================
export const RAVEN_RADIUS = {
  xs: 4,
  sm: 8,
  input: 12,
  button: 12,
  card: 16,
  full: 9999,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const RAVEN_TYPOGRAPHY = {
  // Font Sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 32,
  
  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// ============================================
// COMPONENT DIMENSIONS
// ============================================
export const RAVEN_DIMENSIONS = {
  inputHeight: 56,
  buttonHeight: 50,
  iconSize: 28,
  logoSize: 80,
  socialButtonSize: 60,
} as const;

// ============================================
// ASSET PATHS
// ============================================
export const RAVEN_ASSETS = {
  logo: require('../../assets/images/raven-logo-black.png'),
  appleIcon: require('../../assets/images/apple-icon.png'),
  metaIcon: require('../../assets/images/meta-icon.png'),
  googleIcon: require('../../assets/images/google-icon.png'),
  // Welcome Screen Role Cards
  backpackShot: require('../../assets/images/backpack-shot.png'),
  packageShot: require('../../assets/images/package-shot.png'),
} as const;
