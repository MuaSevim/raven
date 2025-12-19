import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Components
import {
  RavenInput,
  RavenButton,
  SearchableSelect,
  SelectOption,
  PhoneInput,
  ChipSelect,
} from '../components';
import { MeetingPointMap, Coordinates } from '../components/MeetingPointMap';

// Services
import { LocationService } from '../services/LocationService';

// Navigation Types
import { RootStackParamList } from '../../App';

type PostTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostTrip'
>;

// ============================================
// TYPES
// ============================================
interface TripFormData {
  // Step 1: Personal Details
  fullName: string;
  identityNumber: string;
  age: string;
  phoneCountryCode: string;
  phoneNumber: string;
  // Step 2: Flight Route
  departureCountryCode: string;
  departureCountryName: string;
  departureCityId: string;
  departureCityName: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalCountryCode: string;
  arrivalCountryName: string;
  arrivalCityId: string;
  arrivalCityName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  // Step 3: Flight Overview
  pnrNumber: string;
  ticketDocument: string | null;
  passportDocument: string | null;
  // Step 4: Meeting Point
  meetingPointCoords: Coordinates | null;
  meetingPointAddress: string;
  // Step 5: Capacity & Verification
  capacityKg: string;
  pricePerKg: string;
}

const TOTAL_STEPS = 5;

// Capacity options for ChipSelect
const CAPACITY_OPTIONS = [
  { value: '2', label: '2 kg' },
  { value: '5', label: '5 kg' },
  { value: '8', label: '8 kg' },
  { value: '10', label: '10 kg' },
  { value: '15', label: '15 kg' },
  { value: '20', label: '20 kg' },
];

/**
 * PostTripScreen - Multi-step form for Travelers to post their trips
 * 5-step flow matching the design: Details → Route → Overview → Meeting → Verify
 */
export const PostTripScreen: React.FC = () => {
  const navigation = useNavigation<PostTripScreenNavigationProp>();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<TripFormData>({
    fullName: '',
    identityNumber: '',
    age: '',
    phoneCountryCode: '+46',
    phoneNumber: '',
    departureCountryCode: '',
    departureCountryName: '',
    departureCityId: '',
    departureCityName: '',
    departureAirportCode: '',
    departureAirportName: '',
    arrivalCountryCode: '',
    arrivalCountryName: '',
    arrivalCityId: '',
    arrivalCityName: '',
    arrivalAirportCode: '',
    arrivalAirportName: '',
    pnrNumber: '',
    ticketDocument: null,
    passportDocument: null,
    meetingPointCoords: null,
    meetingPointAddress: '',
    capacityKg: '5',
    pricePerKg: '15',
  });

  // Cities loading states
  const [departureCitiesLoading, setDepartureCitiesLoading] = useState(false);
  const [arrivalCitiesLoading, setArrivalCitiesLoading] = useState(false);
  const [departureCityOptions, setDepartureCityOptions] = useState<SelectOption[]>([]);
  const [arrivalCityOptions, setArrivalCityOptions] = useState<SelectOption[]>([]);

  // ============================================
  // LOCATION OPTIONS
  // ============================================
  const countryOptions = useMemo((): SelectOption[] => {
    return LocationService.getAllCountries().map((c) => ({
      id: c.code,
      label: c.name,
      icon: c.flag,
    }));
  }, []);

  // Fetch departure cities when country changes
  useEffect(() => {
    if (!formData.departureCountryCode || !formData.departureCountryName) {
      setDepartureCityOptions([]);
      return;
    }

    setDepartureCitiesLoading(true);
    LocationService.getCitiesByCountryAsync(formData.departureCountryCode)
      .then((cities) => {
        setDepartureCityOptions(
          cities.map((c) => ({ id: c.id, label: c.name }))
        );
      })
      .finally(() => setDepartureCitiesLoading(false));
  }, [formData.departureCountryCode, formData.departureCountryName]);

  // Fetch arrival cities when country changes
  useEffect(() => {
    if (!formData.arrivalCountryCode || !formData.arrivalCountryName) {
      setArrivalCityOptions([]);
      return;
    }

    setArrivalCitiesLoading(true);
    LocationService.getCitiesByCountryAsync(formData.arrivalCountryCode)
      .then((cities) => {
        setArrivalCityOptions(
          cities.map((c) => ({ id: c.id, label: c.name }))
        );
      })
      .finally(() => setArrivalCitiesLoading(false));
  }, [formData.arrivalCountryCode, formData.arrivalCountryName]);

  const departureAirportOptions = useMemo((): SelectOption[] => {
    if (!formData.departureCountryCode) return [];
    return LocationService.getAirportsByCountry(formData.departureCountryCode).map(
      (a) => ({ id: a.code, label: `${a.code} - ${a.name}`, sublabel: a.city })
    );
  }, [formData.departureCountryCode]);

  const arrivalAirportOptions = useMemo((): SelectOption[] => {
    if (!formData.arrivalCountryCode) return [];
    return LocationService.getAirportsByCountry(formData.arrivalCountryCode).map(
      (a) => ({ id: a.code, label: `${a.code} - ${a.name}`, sublabel: a.city })
    );
  }, [formData.arrivalCountryCode]);

  // Get map center based on departure airport (default meeting point)
  const mapCenter = useMemo((): Coordinates => {
    // First try departure airport coordinates
    if (formData.departureAirportCode) {
      const airport = LocationService.getAirportByCode(formData.departureAirportCode);
      if (airport && airport.lat && airport.lng) {
        return { lat: airport.lat, lng: airport.lng };
      }
    }
    // Fallback to departure city
    if (formData.departureCityId) {
      const coords = LocationService.getCityCoordinates(formData.departureCityId);
      if (coords) return coords;
    }
    return { lat: 59.3293, lng: 18.0686 }; // Default: Stockholm
  }, [formData.departureAirportCode, formData.departureCityId]);

  // ============================================
  // HELPERS
  // ============================================
  const updateField = useCallback(
    (field: keyof TripFormData, value: string | Coordinates | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return 'Post a Flight';
      case 2:
        return 'Post a Flight';
      case 3:
        return 'Flight Overview';
      case 4:
        return 'Flight Overview';
      case 5:
        return 'Final Step';
      default:
        return 'Post a Flight';
    }
  };

  // ============================================
  // DOCUMENT PICKER
  // ============================================
  const handlePickDocument = async (type: 'ticket' | 'passport') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const field = type === 'ticket' ? 'ticketDocument' : 'passportDocument';
        updateField(field, result.assets[0].name);
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleClose = () => {
    Alert.alert('Discard Trip?', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handlePostTrip();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePostTrip = () => {
    console.log('=== Trip Posted ===');
    console.log('Traveler:', formData.fullName);
    console.log(
      'Route:',
      `${formData.departureAirportCode} → ${formData.arrivalAirportCode}`
    );
    console.log('Capacity:', `${formData.capacityKg}kg @ $${formData.pricePerKg}/kg`);
    console.log('Meeting Point:', formData.meetingPointCoords);
    console.log('===================');

    // Navigate to success screen
    navigation.navigate('TravelerFeed');
  };

  const handleLocationSelect = useCallback(
    (coords: Coordinates) => {
      updateField('meetingPointCoords', coords);
    },
    [updateField]
  );

  // ============================================
  // STEP INDICATOR
  // ============================================
  const renderStepIndicator = () => (
    <XStack justifyContent="center" gap={6} marginBottom="$4">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index + 1 <= currentStep && styles.stepDotActive,
          ]}
        />
      ))}
    </XStack>
  );

  // ============================================
  // STEP 1: YOUR DETAILS
  // ============================================
  const renderStep1 = () => (
    <YStack gap={16}>
      <Text style={styles.stepHeading}>Your Details</Text>

      <RavenInput
        label="Full name"
        placeholder=""
        value={formData.fullName}
        onChangeText={(v: string) => updateField('fullName', v)}
        autoCapitalize="words"
      />

      <RavenInput
        label="Identity Number"
        placeholder=""
        value={formData.identityNumber}
        onChangeText={(v: string) => updateField('identityNumber', v)}
      />

      <RavenInput
        label="Age"
        placeholder=""
        value={formData.age}
        onChangeText={(v: string) => updateField('age', v)}
        keyboardType="numeric"
      />

      {/* Phone Input with Country Code */}
      <PhoneInput
        label="Phone Number"
        countryCode={formData.phoneCountryCode}
        phoneNumber={formData.phoneNumber}
        onCountryCodeChange={(code) => updateField('phoneCountryCode', code)}
        onPhoneNumberChange={(num) => updateField('phoneNumber', num)}
      />
    </YStack>
  );

  // ============================================
  // STEP 2: FLIGHT ROUTE
  // ============================================
  const renderStep2 = () => (
    <YStack gap={16}>
      <Text style={styles.stepHeading}>Set Your Flight Route</Text>

      {/* Departure */}
      <SearchableSelect
        label="Departure Country"
        placeholder="Select country"
        value={formData.departureCountryName}
        options={countryOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            departureCountryCode: opt.id,
            departureCountryName: opt.label,
            departureCityId: '',
            departureCityName: '',
            departureAirportCode: '',
            departureAirportName: '',
          }));
        }}
      />

      <SearchableSelect
        label="Departure City"
        placeholder={departureCitiesLoading ? "Loading cities..." : "Select your city"}
        value={formData.departureCityName}
        options={departureCityOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            departureCityId: opt.id,
            departureCityName: opt.label,
          }));
        }}
        disabled={!formData.departureCountryCode || departureCitiesLoading}
      />

      <SearchableSelect
        label="Departure Airport"
        placeholder="Select airport"
        value={formData.departureAirportName}
        options={departureAirportOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            departureAirportCode: opt.id,
            departureAirportName: opt.label,
          }));
        }}
        disabled={!formData.departureCountryCode}
      />

      {/* Arrival */}
      <Text style={styles.sectionLabel}>Arrival</Text>

      <SearchableSelect
        label="Arrival Country"
        placeholder="Select country"
        value={formData.arrivalCountryName}
        options={countryOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            arrivalCountryCode: opt.id,
            arrivalCountryName: opt.label,
            arrivalCityId: '',
            arrivalCityName: '',
            arrivalAirportCode: '',
            arrivalAirportName: '',
          }));
        }}
      />

      <SearchableSelect
        label="Arrival City"
        placeholder={arrivalCitiesLoading ? "Loading cities..." : "Select your city"}
        value={formData.arrivalCityName}
        options={arrivalCityOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            arrivalCityId: opt.id,
            arrivalCityName: opt.label,
          }));
        }}
        disabled={!formData.arrivalCountryCode || arrivalCitiesLoading}
      />

      <SearchableSelect
        label="Arrival Airport"
        placeholder="Select airport"
        value={formData.arrivalAirportName}
        options={arrivalAirportOptions}
        onSelect={(opt) => {
          setFormData((prev) => ({
            ...prev,
            arrivalAirportCode: opt.id,
            arrivalAirportName: opt.label,
          }));
        }}
        disabled={!formData.arrivalCountryCode}
      />
    </YStack>
  );

  // ============================================
  // STEP 3: FLIGHT OVERVIEW (PNR & Documents)
  // ============================================
  const renderStep3 = () => (
    <YStack gap={16}>
      <RavenInput
        label="PNR Information"
        placeholder="Enter your PNR/Booking Reference"
        value={formData.pnrNumber}
        onChangeText={(v: string) => updateField('pnrNumber', v)}
        autoCapitalize="characters"
      />

      {/* Ticket Upload */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => handlePickDocument('ticket')}
        activeOpacity={0.7}
      >
        {formData.ticketDocument ? (
          <View style={styles.uploadedContent}>
            <Ionicons
              name="document-text"
              size={24}
              color={RAVEN_LIGHT.success}
            />
            <Text style={styles.uploadedText}>{formData.ticketDocument}</Text>
          </View>
        ) : (
          <Text style={styles.uploadText}>Ticket PDF Upload</Text>
        )}
      </TouchableOpacity>

      {/* Passport Upload */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => handlePickDocument('passport')}
        activeOpacity={0.7}
      >
        {formData.passportDocument ? (
          <View style={styles.uploadedContent}>
            <Ionicons
              name="document-text"
              size={24}
              color={RAVEN_LIGHT.success}
            />
            <Text style={styles.uploadedText}>{formData.passportDocument}</Text>
          </View>
        ) : (
          <Text style={styles.uploadText}>Passport PDF Upload</Text>
        )}
      </TouchableOpacity>
    </YStack>
  );

  // ============================================
  // STEP 4: MEETING POINT (Map)
  // ============================================
  const renderStep4 = () => (
    <YStack gap={16}>
      <Text style={styles.stepHeading}>Preferred Meeting Point</Text>
      <Text style={styles.stepSubheading}>
        Default is set to your departure airport. Drag the marker to choose a different meeting point.
      </Text>

      <MeetingPointMap
        initialCenter={mapCenter}
        initialZoom={13}
        onLocationSelect={handleLocationSelect}
        height={280}
        markerTitle="Meeting Point"
        searchEnabled={true}
      />

      {formData.meetingPointCoords && (
        <View style={styles.coordsDisplay}>
          <Ionicons name="location" size={16} color={RAVEN_LIGHT.success} />
          <Text style={styles.coordsText}>
            Location selected: {formData.meetingPointCoords.lat.toFixed(4)},{' '}
            {formData.meetingPointCoords.lng.toFixed(4)}
          </Text>
        </View>
      )}
    </YStack>
  );

  // ============================================
  // STEP 5: VERIFY & CAPACITY
  // ============================================
  const renderStep5 = () => (
    <YStack gap={16}>
      <Text style={styles.stepHeading}>Verify Your Identity</Text>
      <Text style={styles.stepSubheading}>
        Please open your camera to scan your face for verification.
      </Text>

      {/* Camera Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Ionicons name="camera-outline" size={64} color={RAVEN_LIGHT.border} />
      </View>

      {/* Capacity Selection - Using ChipSelect */}
      <ChipSelect
        label="Available Capacity"
        options={CAPACITY_OPTIONS}
        value={formData.capacityKg}
        onSelect={(val) => updateField('capacityKg', val)}
      />

      {/* Price per kg */}
      <RavenInput
        label="Price per kg ($)"
        placeholder="15"
        value={formData.pricePerKg}
        onChangeText={(v: string) => updateField('pricePerKg', v)}
        keyboardType="numeric"
      />
    </YStack>
  );

  // ============================================
  // RENDER CURRENT STEP
  // ============================================
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
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
          onPress={currentStep === 1 ? handleClose : handleBack}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentStep === 1 ? 'close' : 'arrow-back'}
            size={24}
            color={RAVEN_LIGHT.primaryText}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
      </XStack>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView
        flex={1}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} paddingHorizontal={RAVEN_SPACING.screenPadding}>
          {renderCurrentStep()}
          <YStack flex={1} minHeight="$4" />
        </YStack>
      </ScrollView>

      {/* Sticky Footer */}
      <YStack
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        paddingVertical="$4"
        backgroundColor={RAVEN_LIGHT.background}
      >
        <RavenButton onPress={handleNext}>
          {currentStep === TOTAL_STEPS ? 'Proceed' : 'Next'}
        </RavenButton>
      </YStack>
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
  scrollContent: {
    flexGrow: 1,
  },
  headerButton: {
    position: 'absolute',
    left: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: RAVEN_TYPOGRAPHY.lg,
    fontWeight: '600',
    color: RAVEN_LIGHT.primaryText,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RAVEN_LIGHT.divider,
  },
  stepDotActive: {
    backgroundColor: RAVEN_LIGHT.primaryText,
  },
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
  cameraPlaceholder: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.card,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});
