import React, { ReactNode, memo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { YStack } from 'tamagui';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { RAVEN_LIGHT, RAVEN_SPACING } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface ScreenWrapperProps {
  /** Screen content */
  children: ReactNode;
  /** Whether to wrap content in ScrollView */
  scrollable?: boolean;
  /** Whether to handle keyboard avoiding behavior */
  keyboardAware?: boolean;
  /** Safe area edges to respect */
  edges?: Edge[];
  /** Custom background color */
  backgroundColor?: string;
  /** Whether to apply horizontal padding */
  withPadding?: boolean;
  /** Custom padding horizontal value */
  paddingHorizontal?: number | string;
  /** Whether to show vertical scroll indicator */
  showScrollIndicator?: boolean;
  /** Additional style for inner content */
  contentStyle?: ViewStyle;
  /** Footer component (sticky at bottom) */
  footer?: ReactNode;
  /** Keyboard vertical offset for iOS */
  keyboardVerticalOffset?: number;
}

/**
 * ScreenWrapper - Consistent screen container with common layout patterns
 * 
 * Eliminates duplicate SafeAreaView/ScrollView/KeyboardAvoidingView patterns
 * across all screens.
 * 
 * @example
 * // Basic scrollable screen
 * <ScreenWrapper scrollable>
 *   <YourContent />
 * </ScreenWrapper>
 * 
 * @example
 * // Form screen with sticky footer
 * <ScreenWrapper scrollable keyboardAware footer={<RavenButton>Submit</RavenButton>}>
 *   <FormContent />
 * </ScreenWrapper>
 */
export const ScreenWrapper = memo<ScreenWrapperProps>(({
  children,
  scrollable = false,
  keyboardAware = false,
  edges = ['top', 'bottom'],
  backgroundColor = RAVEN_LIGHT.background,
  withPadding = true,
  paddingHorizontal = RAVEN_SPACING.screenPadding,
  showScrollIndicator = false,
  contentStyle,
  footer,
  keyboardVerticalOffset = 0,
}) => {
  const content = (
    <YStack
      flex={1}
      paddingHorizontal={withPadding ? paddingHorizontal : 0}
      style={contentStyle}
    >
      {children}
    </YStack>
  );

  const scrollContent = scrollable ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={showScrollIndicator}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const keyboardContent = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {scrollContent}
      {footer}
    </KeyboardAvoidingView>
  ) : (
    <>
      {scrollContent}
      {footer}
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={edges}>
      {keyboardContent}
    </SafeAreaView>
  );
});

ScreenWrapper.displayName = 'ScreenWrapper';

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
