import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RAVEN_LIGHT, RAVEN_TYPOGRAPHY, RAVEN_RADIUS } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
type PickerType = 'day' | 'month' | 'year';

interface DatePickerFieldProps {
  label?: string;
  day: string;
  month: string;
  year: string;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  error?: string;
  /** Auto-advance to next picker after selection */
  autoAdvance?: boolean;
}

// ============================================
// CONSTANTS
// ============================================
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const getDays = (): { value: string; label: string }[] => {
  return Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return { value: day, label: day };
  });
};

const getYears = (): { value: string; label: string }[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const endYear = currentYear - 13; // Minimum 13 years old
  
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = String(endYear - i);
    return { value: year, label: year };
  });
};

// ============================================
// COMPONENT
// ============================================
export const DatePickerField: React.FC<DatePickerFieldProps> = React.memo(({
  label,
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  error,
  autoAdvance = true,
}) => {
  const [pickerType, setPickerType] = useState<PickerType | null>(null);

  const openPicker = useCallback((type: PickerType) => {
    setPickerType(type);
  }, []);

  const closePicker = useCallback(() => {
    setPickerType(null);
  }, []);

  // Auto-advance to the next picker
  const advanceToNextPicker = useCallback((currentType: PickerType) => {
    if (!autoAdvance) {
      closePicker();
      return;
    }
    
    // Small delay for smooth UX
    setTimeout(() => {
      if (currentType === 'day' && !month) {
        setPickerType('month');
      } else if (currentType === 'month' && !year) {
        setPickerType('year');
      } else {
        setPickerType(null);
      }
    }, 150);
  }, [autoAdvance, month, year, closePicker]);

  const handleSelect = useCallback((value: string) => {
    if (pickerType === 'day') {
      onDayChange(value);
      advanceToNextPicker('day');
    } else if (pickerType === 'month') {
      onMonthChange(value);
      advanceToNextPicker('month');
    } else if (pickerType === 'year') {
      onYearChange(value);
      closePicker();
    }
  }, [pickerType, onDayChange, onMonthChange, onYearChange, advanceToNextPicker, closePicker]);

  const getPickerData = () => {
    switch (pickerType) {
      case 'day':
        return getDays();
      case 'month':
        return MONTHS;
      case 'year':
        return getYears();
      default:
        return [];
    }
  };

  const getPickerTitle = () => {
    switch (pickerType) {
      case 'day':
        return 'Select Day';
      case 'month':
        return 'Select Month';
      case 'year':
        return 'Select Year';
      default:
        return '';
    }
  };

  const getMonthLabel = (monthValue: string): string => {
    const found = MONTHS.find((m) => m.value === monthValue);
    return found ? found.label.substring(0, 3) : '';
  };

  const renderItem = ({ item }: { item: { value: string; label: string } }) => {
    const isSelected =
      (pickerType === 'day' && item.value === day) ||
      (pickerType === 'month' && item.value === month) ||
      (pickerType === 'year' && item.value === year);

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
        onPress={() => handleSelect(item.value)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionLabel,
            isSelected && styles.optionLabelSelected,
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={20} color={RAVEN_LIGHT.primaryText} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.fieldsRow}>
        {/* Day Picker */}
        <TouchableOpacity
          style={[styles.field, day && styles.fieldFilled]}
          onPress={() => openPicker('day')}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldText, !day && styles.fieldPlaceholder]}>
            {day || 'DD'}
          </Text>
        </TouchableOpacity>

        {/* Month Picker */}
        <TouchableOpacity
          style={[styles.field, month && styles.fieldFilled]}
          onPress={() => openPicker('month')}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldText, !month && styles.fieldPlaceholder]}>
            {month ? getMonthLabel(month) : 'MM'}
          </Text>
        </TouchableOpacity>

        {/* Year Picker */}
        <TouchableOpacity
          style={[styles.field, styles.fieldYear, year && styles.fieldFilled]}
          onPress={() => openPicker('year')}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldText, !year && styles.fieldPlaceholder]}>
            {year || 'YYYY'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Picker Modal */}
      <Modal
        visible={pickerType !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closePicker}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={RAVEN_LIGHT.primaryText}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{getPickerTitle()}</Text>
              <View style={styles.closeButton} />
            </View>

            {/* Options List */}
            <FlatList
              data={getPickerData()}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

DatePickerField.displayName = 'DatePickerField';

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    fontWeight: '500',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 8,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldFilled: {
    borderColor: RAVEN_LIGHT.primaryText,
  },
  fieldYear: {
    flex: 1.5,
  },
  fieldText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    fontWeight: '500',
  },
  fieldPlaceholder: {
    color: RAVEN_LIGHT.inputPlaceholder,
    fontWeight: '400',
  },
  errorText: {
    color: RAVEN_LIGHT.error,
    fontSize: RAVEN_TYPOGRAPHY.xs,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: RAVEN_LIGHT.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: RAVEN_LIGHT.divider,
  },
  modalTitle: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    flex: 1,
  },
  optionsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: RAVEN_LIGHT.divider,
  },
  optionItemSelected: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionLabel: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
});
