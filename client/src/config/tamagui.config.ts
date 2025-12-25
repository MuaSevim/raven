import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createMedia } from '@tamagui/react-native-media-driver'
import { createAnimations } from '@tamagui/animations-react-native'

// ============================================
// FONTS - Simple configuration
// ============================================
const interFont = createInterFont()

// ============================================
// TOKENS - Explicit values, no spreads
// ============================================
const tokens = createTokens({
  color: {
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray400: '#A3A3A3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',
    blue500: '#3B82F6',
    green500: '#22C55E',
    red500: '#EF4444',
    yellow500: '#F59E0B',
    transparent: 'transparent',
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 12,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 48,
    12: 56,
    13: 64,
    14: 80,
    15: 96,
    16: 128,
    true: 16,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    true: 16,
    '-1': -4,
    '-2': -8,
    '-3': -12,
    '-4': -16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

// ============================================
// THEMES - Explicit string values only
// ============================================
const lightTheme = {
  background: '#FFFFFF',
  backgroundHover: '#F5F5F5',
  backgroundPress: '#E5E5E5',
  backgroundFocus: '#F5F5F5',
  backgroundStrong: '#FFFFFF',
  backgroundTransparent: 'transparent',
  color: '#000000',
  colorHover: '#000000',
  colorPress: '#525252',
  colorFocus: '#000000',
  colorTransparent: 'transparent',
  borderColor: '#E5E5E5',
  borderColorHover: '#D4D4D4',
  borderColorFocus: '#3B82F6',
  borderColorPress: '#D4D4D4',
  placeholderColor: '#A3A3A3',
}

const darkTheme = {
  background: '#121212',
  backgroundHover: '#1E1E1E',
  backgroundPress: '#2A2A2A',
  backgroundFocus: '#1E1E1E',
  backgroundStrong: '#0A0A0A',
  backgroundTransparent: 'transparent',
  color: '#FFFFFF',
  colorHover: '#F5F5F5',
  colorPress: '#D4D4D4',
  colorFocus: '#FFFFFF',
  colorTransparent: 'transparent',
  borderColor: '#2A2A2A',
  borderColorHover: '#3A3A3A',
  borderColorFocus: '#3B82F6',
  borderColorPress: '#3A3A3A',
  placeholderColor: '#6B6B6B',
}

// ============================================
// ANIMATIONS - Simple config
// ============================================
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

// ============================================
// MEDIA QUERIES
// ============================================
const media = createMedia({
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 661 },
  gtSm: { minWidth: 801 },
  gtMd: { minWidth: 1021 },
  gtLg: { minWidth: 1281 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
})

// ============================================
// CREATE CONFIG - Simple, no complex spreads
// ============================================
const config = createTamagui({
  tokens: tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    heading: interFont,
    body: interFont,
  },
  shorthands: shorthands,
  animations: animations,
  media: media,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
