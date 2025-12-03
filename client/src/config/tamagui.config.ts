import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes as tamaguiThemes, tokens as tamaguiTokens } from '@tamagui/themes'
import { createMedia } from '@tamagui/react-native-media-driver'
import { createAnimations } from '@tamagui/animations-react-native'

// Raven Design System Colors
const ravenColors = {
  // Core colors
  background: '#121212',
  cardSurface: '#1E1E1E',
  primaryAccent: '#2D60FF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  
  // Extended palette
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Accent variations
  primaryAccentLight: '#4B7BFF',
  primaryAccentDark: '#1A4AD4',
  
  // Surface variations
  surfaceElevated: '#252525',
  surfacePressed: '#2A2A2A',
}

// Create Inter font with specific weights
const interFont = createInterFont({
  face: {
    400: { normal: 'Inter_400Regular' },
    600: { normal: 'Inter_600SemiBold' },
    700: { normal: 'Inter_600SemiBold' },
    800: { normal: 'Inter_800ExtraBold' },
  },
})

// Custom tokens extending Tamagui defaults
const tokens = createTokens({
  ...tamaguiTokens,
  color: {
    ...tamaguiTokens.color,
    // Raven design system colors
    ravenBackground: ravenColors.background,
    ravenCard: ravenColors.cardSurface,
    ravenPrimary: ravenColors.primaryAccent,
    ravenTextPrimary: ravenColors.textPrimary,
    ravenTextSecondary: ravenColors.textSecondary,
    ravenBorder: ravenColors.border,
    ravenSuccess: ravenColors.success,
    ravenWarning: ravenColors.warning,
    ravenError: ravenColors.error,
    ravenInfo: ravenColors.info,
  },
  radius: {
    ...tamaguiTokens.radius,
    button: 12,
    card: 16,
    input: 8,
  },
  size: {
    ...tamaguiTokens.size,
    buttonHeight: 50,
    inputHeight: 56,
    cardPadding: 16,
  },
  space: {
    ...tamaguiTokens.space,
  },
})

// Raven dark theme
const ravenDarkTheme = {
  background: ravenColors.background,
  backgroundHover: ravenColors.surfaceElevated,
  backgroundPress: ravenColors.surfacePressed,
  backgroundFocus: ravenColors.surfaceElevated,
  backgroundStrong: ravenColors.cardSurface,
  backgroundTransparent: 'transparent',
  
  color: ravenColors.textPrimary,
  colorHover: ravenColors.textPrimary,
  colorPress: ravenColors.textSecondary,
  colorFocus: ravenColors.textPrimary,
  colorTransparent: 'transparent',
  
  borderColor: ravenColors.border,
  borderColorHover: ravenColors.primaryAccent,
  borderColorFocus: ravenColors.primaryAccent,
  borderColorPress: ravenColors.border,
  
  placeholderColor: ravenColors.textSecondary,
  
  // Primary button colors
  blue1: ravenColors.primaryAccentDark,
  blue2: ravenColors.primaryAccent,
  blue3: ravenColors.primaryAccentLight,
  blue4: ravenColors.primaryAccent,
  blue5: ravenColors.primaryAccent,
  blue6: ravenColors.primaryAccent,
  blue7: ravenColors.primaryAccent,
  blue8: ravenColors.primaryAccent,
  blue9: ravenColors.primaryAccent,
  blue10: ravenColors.primaryAccentLight,
  blue11: ravenColors.textPrimary,
  blue12: ravenColors.textPrimary,
}

const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
})

const media = createMedia({
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
})

const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    ...tamaguiThemes,
    dark: ravenDarkTheme,
    dark_blue: ravenDarkTheme,
  },
  fonts: {
    heading: interFont,
    body: interFont,
  },
  shorthands,
  animations,
  media,
  defaultTheme: 'dark',
})

export default tamaguiConfig

// Raven design constants for easy access
export const RAVEN_COLORS = ravenColors
export const RAVEN_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
export const RAVEN_RADIUS = {
  button: 12,
  card: 16,
  input: 8,
}

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
