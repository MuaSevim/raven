import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

// ============================================
// CUSTOM THEMES - Explicit string values only
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
// CREATE TAMAGUI CONFIG
// Extends the pre-built config with our custom themes
// ============================================
const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      ...lightTheme,
    },
    dark: {
      ...config.themes.dark,
      ...darkTheme,
    },
  },
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
