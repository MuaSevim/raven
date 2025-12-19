/**
 * ============================================
 * SCREEN HELPERS - DRY utilities for common screen patterns
 * ============================================
 * Eliminates duplicate code across screens for layout, keyboard handling, and SafeArea
 */

import { Platform, ViewStyle } from 'react-native';
import { RAVEN_SPACING } from '../config/theme.config';

/**
 * Get platform-specific SafeArea edges
 * iOS: includes top, bottom
 * Android: minimal edges (handled by system)
 */
export const getSafeAreaEdges = (edges?: ('top' | 'bottom' | 'left' | 'right')[]): ('top' | 'bottom' | 'left' | 'right')[] => {
  if (edges) return edges;
  return Platform.OS === 'ios' ? ['top', 'bottom'] : [];
};

/**
 * Get KeyboardAvoidingView behavior based on platform
 */
export const getKeyboardBehavior = (): 'padding' | 'height' | 'position' => {
  return Platform.OS === 'ios' ? 'padding' : 'height';
};

/**
 * Get platform-specific vertical offset for keyboard
 * iOS needs extra offset for notched devices
 */
export const getKeyboardVerticalOffset = (): number => {
  return Platform.OS === 'ios' ? 0 : 0;
};

/**
 * Common ScrollView container style for screens
 */
export const scrollViewContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: RAVEN_SPACING.md,
};

/**
 * Common screen flex container style
 */
export const screenFlexStyle: ViewStyle = {
  flex: 1,
};

/**
 * Safe hit area for small touch targets (Apple HIG recommends 44x44)
 */
export const TOUCH_TARGET_SIZE = 44;

export const defaultHitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

/**
 * Optimize rendering with memoization thresholds
 */
export const RENDER_OPTIMIZATION = {
  listInitialNumToRender: 10,
  listMaxToRenderPerBatch: 10,
  listUpdateCellsBatchingPeriod: 50,
  listWindowSize: 21,
};
