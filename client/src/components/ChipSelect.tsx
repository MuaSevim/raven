import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { XStack, Text } from 'tamagui';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_RADIUS,
} from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface ChipOption<T = string> {
  value: T;
  label: string;
}

export interface ChipSelectProps<T = string> {
  /** Label above the chip group */
  label?: string;
  /** Available options */
  options: ChipOption<T>[];
  /** Currently selected value */
  value: T;
  /** Callback when selection changes */
  onSelect: (value: T) => void;
  /** Render as row (horizontal) or column (vertical) */
  direction?: 'horizontal' | 'vertical';
  /** Whether multiple selections are allowed (future) */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Whether to wrap chips when they overflow */
  wrap?: boolean;
}

/**
 * ChipSelect - Reusable chip/tag selection component
 * Eliminates duplicate chip selection patterns across screens
 * (capacity chips, meeting points, price chips, payment methods)
 *
 * @example
 * <ChipSelect
 *   label="Available Capacity"
 *   options={[
 *     { value: '2', label: '2 kg' },
 *     { value: '5', label: '5 kg' },
 *     { value: '10', label: '10 kg' },
 *   ]}
 *   value={selectedCapacity}
 *   onSelect={(val) => setSelectedCapacity(val)}
 * />
 */
export function ChipSelect<T extends string | number>({
  label,
  options,
  value,
  onSelect,
  direction = 'horizontal',
  disabled = false,
  wrap = true,
}: ChipSelectProps<T>) {
  const isSelected = (optValue: T) => optValue === value;

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <XStack
        flexDirection={direction === 'horizontal' ? 'row' : 'column'}
        flexWrap={wrap ? 'wrap' : 'nowrap'}
        gap={8}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <TouchableOpacity
              key={String(option.value)}
              onPress={() => !disabled && onSelect(option.value)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <View
                style={[
                  styles.chip,
                  selected && styles.chipActive,
                  disabled && styles.chipDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  label: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RAVEN_RADIUS.button,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: RAVEN_LIGHT.primaryText,
    borderColor: RAVEN_LIGHT.primaryText,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.primaryText,
  },
  chipTextActive: {
    color: RAVEN_LIGHT.background,
    fontWeight: '600',
  },
});
