/**
 * Common Styles - Shared StyleSheet definitions
 * Eliminates duplicate style definitions across screens
 */
import { StyleSheet } from 'react-native';
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_RADIUS,
} from '../config/theme.config';

/**
 * Common styles used across multiple screens
 * Import and spread into local StyleSheet.create() or use directly
 */
export const commonStyles = StyleSheet.create({
  // ============================================
  // LAYOUT
  // ============================================
  safeArea: {
    flex: 1,
    backgroundColor: RAVEN_LIGHT.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: RAVEN_LIGHT.background,
  },

  // ============================================
  // HEADER
  // ============================================
  headerButton: {
    position: 'absolute',
    left: 20,
    padding: 4,
  },
  headerButtonRight: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
  },

  // ============================================
  // STEP INDICATORS
  // ============================================
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RAVEN_LIGHT.divider,
  },
  stepDotActive: {
    backgroundColor: RAVEN_LIGHT.primaryText,
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  stepHeading: {
    fontSize: RAVEN_TYPOGRAPHY.xl,
    fontWeight: '700',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 4,
  },
  stepSubheading: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    fontWeight: '500',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 8,
  },
  errorText: {
    color: RAVEN_LIGHT.error,
    fontSize: RAVEN_TYPOGRAPHY.xs,
    marginTop: -8,
  },

  // ============================================
  // INPUTS
  // ============================================
  textInput: {
    backgroundColor: RAVEN_LIGHT.background,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
  },
  textArea: {
    backgroundColor: 'transparent',
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    minHeight: 100,
    padding: 0,
  },

  // ============================================
  // UPLOAD BOXES
  // ============================================
  uploadBox: {
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
    borderStyle: 'dashed',
    borderRadius: RAVEN_RADIUS.card,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  uploadText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
  },
  uploadedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadedText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.success,
  },

  // ============================================
  // CARDS
  // ============================================
  card: {
    backgroundColor: RAVEN_LIGHT.background,
    borderRadius: RAVEN_RADIUS.card,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
    padding: 16,
    marginBottom: 12,
  },

  // ============================================
  // IMAGE PREVIEW
  // ============================================
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: RAVEN_RADIUS.card,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RAVEN_RADIUS.card,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // ============================================
  // EMPTY STATES
  // ============================================
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
    marginTop: 4,
  },

  // ============================================
  // INFO DISPLAYS
  // ============================================
  coordsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: RAVEN_LIGHT.inputBackground,
    padding: 12,
    borderRadius: RAVEN_RADIUS.input,
  },
  coordsText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
  },

  // ============================================
  // CAMERA/PLACEHOLDER
  // ============================================
  cameraPlaceholder: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.card,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Creates a StyleSheet with common styles included
 * Use this helper to merge common styles with screen-specific styles
 *
 * @example
 * const styles = createScreenStyles({
 *   customButton: { padding: 20 },
 * });
 * // Then use: styles.safeArea, styles.customButton, etc.
 */
export const createScreenStyles = <T extends StyleSheet.NamedStyles<T>>(
  screenStyles: T
) => {
  return StyleSheet.create({
    ...commonStyles,
    ...screenStyles,
  } as typeof commonStyles & T);
};
