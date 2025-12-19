import React from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
} from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface TabBarItemConfig {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export interface TabBarProps {
  items: TabBarItemConfig[];
  /** Optional height override (default: 70) */
  height?: number;
}

// ============================================
// TAB BAR ITEM COMPONENT
// ============================================
interface TabBarItemProps extends TabBarItemConfig {}

const TabBarItem: React.FC<TabBarItemProps> = ({
  icon,
  label,
  active = false,
  onPress,
}) => {
  const iconName = active ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <YStack alignItems="center" space="$1">
        <Ionicons
          name={iconName}
          size={24}
          color={active ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.secondaryText}
        />
        <Text
          fontSize={RAVEN_TYPOGRAPHY.xs}
          color={active ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.secondaryText}
          fontWeight={active ? RAVEN_TYPOGRAPHY.medium : RAVEN_TYPOGRAPHY.regular}
        >
          {label}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
};

// ============================================
// TAB BAR COMPONENT
// ============================================
/**
 * TabBar - Reusable bottom tab bar component
 * Eliminates duplicate tab bar implementations across screens
 *
 * @example
 * <TabBar
 *   items={[
 *     { icon: 'home', label: 'Home', active: true, onPress: () => nav('Home') },
 *     { icon: 'add-circle', label: 'Deliveries', onPress: () => nav('Deliveries') },
 *     { icon: 'airplane', label: 'Trips', onPress: () => nav('Trips') },
 *     { icon: 'person', label: 'Profile', onPress: () => nav('Profile') },
 *   ]}
 * />
 */
export const TabBar: React.FC<TabBarProps> = ({ items, height = 70 }) => {
  return (
    <XStack
      height={height}
      backgroundColor={RAVEN_LIGHT.background}
      borderTopWidth={1}
      borderTopColor={RAVEN_LIGHT.border}
      alignItems="center"
      justifyContent="space-around"
      paddingHorizontal="$4"
    >
      {items.map((item, index) => (
        <TabBarItem
          key={`${item.label}-${index}`}
          icon={item.icon}
          label={item.label}
          active={item.active}
          onPress={item.onPress}
        />
      ))}
    </XStack>
  );
};
