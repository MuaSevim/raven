import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Components
import { ShipmentCard, TabBar, FloatingActionButton } from '../components';

// Data
import { MOCK_SHIPMENTS, Shipment } from '../data/mockData';

// Navigation Types
import { RootStackParamList } from '../../App';

type TravelerFeedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TravelerFeed'>;

// ============================================
// FILTER CHIP COMPONENT (Inline)
// ============================================
interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  showDropdown?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  active = false, 
  onPress,
  showDropdown = true,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <XStack
      backgroundColor={active ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.inputBackground}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={RAVEN_RADIUS.button}
      alignItems="center"
      space="$1"
    >
      <Text
        fontSize={RAVEN_TYPOGRAPHY.sm}
        color={active ? RAVEN_LIGHT.buttonPrimaryText : RAVEN_LIGHT.primaryText}
      >
        {label}
      </Text>
      {showDropdown && (
        <Ionicons
          name="chevron-down"
          size={16}
          color={active ? RAVEN_LIGHT.buttonPrimaryText : RAVEN_LIGHT.primaryText}
        />
      )}
    </XStack>
  </TouchableOpacity>
);

/**
 * TravelerFeedScreen - Shows available shipments for travelers
 * Main screen after selecting "I want to Travel"
 */
export const TravelerFeedScreen: React.FC = () => {
  const navigation = useNavigation<TravelerFeedScreenNavigationProp>();
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // ============================================
  // HANDLERS
  // ============================================
  const handleFilterPress = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    // Future: Open filter modal/dropdown
    Alert.alert('Filter', `${filter} filter coming soon!`);
  };

  const handleShipmentPress = (shipment: Shipment) => {
    // Navigate to shipment details screen
    navigation.navigate('ShipmentDetails', { shipment });
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Filter settings coming soon!');
  };

  // ============================================
  // RENDER
  // ============================================
  const renderShipment = ({ item }: { item: Shipment }) => (
    <ShipmentCard
      shipment={item}
      onPress={() => handleShipmentPress(item)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <YStack flex={1}>
        {/* ========== HEADER ========== */}
        <XStack
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingVertical="$3"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Text
            fontSize={RAVEN_TYPOGRAPHY.lg}
            fontWeight={RAVEN_TYPOGRAPHY.semibold}
            color={RAVEN_LIGHT.primaryText}
          >
            Deliveries
          </Text>
          
          {/* Settings Icon */}
          <TouchableOpacity
            onPress={handleSettingsPress}
            style={{ position: 'absolute', right: 20, padding: 4 }}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={24} color={RAVEN_LIGHT.primaryText} />
          </TouchableOpacity>
        </XStack>

        {/* ========== FILTER BAR ========== */}
        <XStack
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingBottom="$3"
          space="$2"
        >
          <FilterChip
            label="Location"
            active={activeFilter === 'location'}
            onPress={() => handleFilterPress('location')}
          />
          <FilterChip
            label="Date"
            active={activeFilter === 'date'}
            onPress={() => handleFilterPress('date')}
          />
          <FilterChip
            label="Price"
            active={activeFilter === 'price'}
            onPress={() => handleFilterPress('price')}
          />
        </XStack>

        {/* ========== SHIPMENTS LIST ========== */}
        <FlatList
          data={MOCK_SHIPMENTS}
          renderItem={renderShipment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* ========== FLOATING ACTION BUTTON ========== */}
        <FloatingActionButton
          onPress={() => navigation.navigate('PostTrip')}
          icon="add"
        />

        {/* ========== BOTTOM TAB BAR ========== */}
        <TabBar
          items={[
            { icon: 'home', label: 'Home', onPress: () => navigation.navigate('Welcome') },
            { icon: 'add-circle', label: 'Deliveries', active: true },
            { icon: 'airplane', label: 'Post Trip', onPress: () => navigation.navigate('PostTrip') },
            { icon: 'person', label: 'Profile' },
          ]}
        />
      </YStack>
    </SafeAreaView>
  );
};
