import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RAVEN_LIGHT, RAVEN_TYPOGRAPHY, RAVEN_RADIUS } from '../config/theme.config';

// ============================================
// TYPES
// ============================================
export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  onSearch?: (query: string) => void;
  searchable?: boolean;
  disabled?: boolean;
}

// ============================================
// COMPONENT
// ============================================
export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = 'Select...',
  value,
  options,
  onSelect,
  onSearch,
  searchable = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      setSearchQuery('');
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onSelect(option);
      handleClose();
    },
    [onSelect, handleClose]
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (onSearch) {
        onSearch(text);
      }
    },
    [onSearch]
  );

  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  const renderOption = useCallback(
    ({ item }: { item: SelectOption }) => (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        {item.icon && <Text style={styles.optionIcon}>{item.icon}</Text>}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionLabel}>{item.label}</Text>
          {item.sublabel && (
            <Text style={styles.optionSublabel}>{item.sublabel}</Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleSelect]
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={handleOpen}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.triggerText,
            !value && styles.triggerPlaceholder,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={RAVEN_LIGHT.secondaryText}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={RAVEN_LIGHT.primaryText}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {label || 'Select'}
              </Text>
              <View style={styles.closeButton} />
            </View>

            {/* Search Input */}
            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={RAVEN_LIGHT.secondaryText}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => handleSearchChange('')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={RAVEN_LIGHT.secondaryText}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id}
              renderItem={renderOption}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    fontWeight: '500',
    color: RAVEN_LIGHT.primaryText,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    flex: 1,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
  },
  triggerPlaceholder: {
    color: RAVEN_LIGHT.inputPlaceholder,
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
    maxHeight: '80%',
    minHeight: '50%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RAVEN_LIGHT.inputBackground,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    paddingVertical: 12,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: RAVEN_LIGHT.divider,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    fontWeight: '500',
  },
  optionSublabel: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.secondaryText,
  },
});
