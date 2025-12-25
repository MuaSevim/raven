import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { YStack, XStack } from 'tamagui';
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
import { SearchableSelect, SelectOption, FloatingActionButton, TabBar } from '../components';

// Services
import { LocationService } from '../services/LocationService';

// Navigation Types
import { RootStackParamList } from '../../App';

type FlightSearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FlightSearch'
>;

// ============================================
// MOCK DATA - Available Trips (Posted by Travelers)
// ============================================
interface AvailableTrip {
  id: string;
  traveler: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    tripsCompleted: number;
  };
  route: {
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
  };
  flight: {
    date: string;
    departureTime: string;
    arrivalTime: string;
  };
  capacity: {
    available: number; // kg
    total: number; // kg
  };
  pricePerKg: number;
}

const MOCK_TRIPS: AvailableTrip[] = [
  {
    id: '1',
    traveler: {
      name: 'Muhammed Sevim',
      avatar: 'MS',
      rating: 4.72,
      verified: true,
      tripsCompleted: 23,
    },
    route: {
      origin: 'London',
      originCode: 'LON',
      destination: 'Istanbul',
      destinationCode: 'IST',
    },
    flight: {
      date: 'Dec 15, 2025',
      departureTime: '10:30 AM',
      arrivalTime: '04:45 PM',
    },
    capacity: {
      available: 5,
      total: 10,
    },
    pricePerKg: 15,
  },
  {
    id: '2',
    traveler: {
      name: 'Alice Johnson',
      avatar: 'AJ',
      rating: 4.91,
      verified: true,
      tripsCompleted: 45,
    },
    route: {
      origin: 'Paris',
      originCode: 'PAR',
      destination: 'Berlin',
      destinationCode: 'BER',
    },
    flight: {
      date: 'Dec 18, 2025',
      departureTime: '08:00 AM',
      arrivalTime: '10:30 AM',
    },
    capacity: {
      available: 8,
      total: 15,
    },
    pricePerKg: 12,
  },
  {
    id: '3',
    traveler: {
      name: 'Bob Williams',
      avatar: 'BW',
      rating: 4.50,
      verified: true,
      tripsCompleted: 12,
    },
    route: {
      origin: 'Rome',
      originCode: 'ROM',
      destination: 'Madrid',
      destinationCode: 'MAD',
    },
    flight: {
      date: 'Dec 20, 2025',
      departureTime: '02:00 PM',
      arrivalTime: '06:30 PM',
    },
    capacity: {
      available: 3,
      total: 8,
    },
    pricePerKg: 18,
  },
  {
    id: '4',
    traveler: {
      name: 'Charlie Brown',
      avatar: 'CB',
      rating: 4.88,
      verified: true,
      tripsCompleted: 67,
    },
    route: {
      origin: 'Amsterdam',
      originCode: 'AMS',
      destination: 'Dublin',
      destinationCode: 'DUB',
    },
    flight: {
      date: 'Dec 22, 2025',
      departureTime: '11:00 AM',
      arrivalTime: '01:30 PM',
    },
    capacity: {
      available: 10,
      total: 20,
    },
    pricePerKg: 10,
  },
  {
    id: '5',
    traveler: {
      name: 'Diana Martinez',
      avatar: 'DM',
      rating: 4.95,
      verified: true,
      tripsCompleted: 89,
    },
    route: {
      origin: 'New York',
      originCode: 'JFK',
      destination: 'London',
      destinationCode: 'LHR',
    },
    flight: {
      date: 'Dec 25, 2025',
      departureTime: '09:00 PM',
      arrivalTime: '09:00 AM',
    },
    capacity: {
      available: 15,
      total: 25,
    },
    pricePerKg: 20,
  },
];

// ============================================
// TRIP CARD COMPONENT
// ============================================
interface TripCardProps {
  trip: AvailableTrip;
  onPress: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => (
  <TouchableOpacity
    style={styles.tripCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Route Header */}
    <View style={styles.routeHeader}>
      <Text style={styles.routeText}>
        {trip.route.origin}{' '}
        <Text style={styles.routeArrow}>→</Text>{' '}
        {trip.route.destination}
      </Text>
    </View>

    {/* Flight Times */}
    <Text style={styles.flightTime}>
      {trip.flight.departureTime} ({trip.route.originCode}) · {trip.flight.arrivalTime} ({trip.route.destinationCode})
    </Text>

    {/* Traveler Info Chip */}
    <View style={styles.travelerChip}>
      <Text style={styles.travelerName}>
        {trip.traveler.name} · ★ {trip.traveler.rating.toFixed(2)} / 5.0 · Verified
      </Text>
    </View>

    {/* Capacity & Price Row */}
    <View style={styles.bottomRow}>
      <View style={styles.capacityBadge}>
        <Ionicons name="cube-outline" size={14} color={RAVEN_LIGHT.secondaryText} />
        <Text style={styles.capacityText}>
          {trip.capacity.available}kg available
        </Text>
      </View>
      <Text style={styles.priceText}>
        ${trip.pricePerKg}/kg
      </Text>
    </View>
  </TouchableOpacity>
);

// ============================================
// MAIN COMPONENT
// ============================================
export const FlightSearchScreen: React.FC = () => {
  const navigation = useNavigation<FlightSearchScreenNavigationProp>();

  // Filter state
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Location options
  const cityOptions = useMemo((): SelectOption[] => {
    const cities = LocationService.searchCities('');
    return cities.map((c) => ({
      id: c.id,
      label: c.name,
      sublabel: c.countryCode,
    }));
  }, []);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    let trips = MOCK_TRIPS;

    if (fromCity) {
      trips = trips.filter((t) =>
        t.route.origin.toLowerCase().includes(fromCity.toLowerCase())
      );
    }

    if (toCity) {
      trips = trips.filter((t) =>
        t.route.destination.toLowerCase().includes(toCity.toLowerCase())
      );
    }

    return trips;
  }, [fromCity, toCity]);

  const handleTripPress = useCallback(
    (trip: AvailableTrip) => {
      // Navigate to booking/chat screen (for now, show alert)
      navigation.navigate('ShipmentDetails', {
        shipment: {
          id: trip.id,
          route: {
            origin: trip.route.origin,
            destination: trip.route.destination,
            originCode: trip.route.originCode,
            destinationCode: trip.route.destinationCode,
          },
          date: trip.flight.date,
          dateRange: `${trip.flight.departureTime} - ${trip.flight.arrivalTime}`,
          price: trip.pricePerKg * trip.capacity.available,
          item: {
            title: `${trip.capacity.available}kg capacity`,
            weight: `${trip.capacity.available} kg available`,
            image: null,
          },
          sender: {
            name: trip.traveler.name,
            rating: trip.traveler.rating,
            avatar: trip.traveler.avatar,
          },
        },
      });
    },
    [navigation]
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderTripItem = useCallback(
    ({ item }: { item: AvailableTrip }) => (
      <TripCard trip={item} onPress={() => handleTripPress(item)} />
    ),
    [handleTripPress]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <XStack
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        paddingVertical="$3"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={RAVEN_LIGHT.primaryText} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Current Trips Near You</Text>

        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showFilters ? 'options' : 'options-outline'}
            size={24}
            color={RAVEN_LIGHT.primaryText}
          />
        </TouchableOpacity>
      </XStack>

      {/* Search Filters (Collapsible) */}
      {showFilters && (
        <YStack
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingBottom="$3"
          gap={12}
        >
          <SearchableSelect
            label="From"
            placeholder="Any city"
            value={fromCity}
            options={cityOptions}
            onSelect={(opt) => setFromCity(opt.label)}
          />
          <SearchableSelect
            label="To"
            placeholder="Any city"
            value={toCity}
            options={cityOptions}
            onSelect={(opt) => setToCity(opt.label)}
          />
          {(fromCity || toCity) && (
            <TouchableOpacity
              onPress={() => {
                setFromCity('');
                setToCity('');
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </YStack>
      )}

      {/* Trip List */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="airplane-outline"
              size={48}
              color={RAVEN_LIGHT.secondaryText}
            />
            <Text style={styles.emptyText}>No trips found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search filters
            </Text>
          </View>
        }
      />

      {/* FAB - Post Shipment */}
      <FloatingActionButton
        onPress={() => navigation.navigate('CreateShipment')}
        icon="add"
      />

      {/* Bottom Tab Bar */}
      <TabBar
        items={[
          { icon: 'home', label: 'Home', active: true },
          { icon: 'cube', label: 'Deliveries' },
          { icon: 'airplane', label: 'Trips' },
          { icon: 'person', label: 'Profile' },
        ]}
      />
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RAVEN_LIGHT.background,
  },
  headerButton: {
    position: 'absolute',
    left: 20,
    padding: 4,
  },
  filterButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.info,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  tripCard: {
    backgroundColor: RAVEN_LIGHT.background,
    borderRadius: RAVEN_RADIUS.card,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
    padding: 16,
    marginBottom: 12,
  },
  routeHeader: {
    marginBottom: 4,
  },
  routeText: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '700',
    color: RAVEN_LIGHT.primaryText,
  },
  routeArrow: {
    color: RAVEN_LIGHT.secondaryText,
  },
  flightTime: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
    marginBottom: 12,
  },
  travelerChip: {
    alignSelf: 'flex-start',
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  travelerName: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.primaryText,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capacityText: {
    fontSize: RAVEN_TYPOGRAPHY.sm,
    color: RAVEN_LIGHT.secondaryText,
  },
  priceText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    fontWeight: '600',
    color: RAVEN_LIGHT.success,
  },
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
});
