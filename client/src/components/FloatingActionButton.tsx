import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Design System
import { RAVEN_LIGHT } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface FloatingActionButtonProps {
  /** Icon to display (defaults to 'add') */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon size (defaults to 28) */
  iconSize?: number;
  /** Button size (defaults to 56) */
  size?: number;
  /** Callback when pressed */
  onPress: () => void;
  /** Background color (defaults to primaryText) */
  backgroundColor?: string;
  /** Icon color (defaults to background) */
  iconColor?: string;
  /** Position from bottom (defaults to 90) */
  bottom?: number;
}

/**
 * FloatingActionButton - Reusable FAB component
 * Eliminates duplicate FAB implementations across screens
 *
 * @example
 * <FloatingActionButton
 *   onPress={() => navigation.navigate('CreateShipment')}
 *   icon="add"
 * />
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = 'add',
  iconSize = 28,
  size = 56,
  onPress,
  backgroundColor = RAVEN_LIGHT.primaryText,
  iconColor = RAVEN_LIGHT.background,
  bottom = 90,
}) => {
  const buttonStyles = [
    styles.fab,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      bottom,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
