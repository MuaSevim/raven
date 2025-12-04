import React, { useState, useMemo, useCallback } from 'react';
import {
  TouchableOpacity,
  Alert,
  TextInput,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { YStack, XStack, Text, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
} from '../components';

// Services
import { LocationService } from '../services/LocationService';

// Navigation Types
import { RootStackParamList } from '../../App';

type CreateShipmentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateShipment'
>;

// ============================================
// TYPES
// ============================================
interface ShipmentFormData {
  // Step 1: Route
  originCountryCode: string;
  originCountryName: string;
  originCityId: string;
  originCityName: string;
  meetingPoint: 'Airport' | 'City Center' | 'Other';
  destinationAirportCode: string;
  destinationAirportName: string;
  // Step 2: Package Details
  weight: string;
  contents: string;
  packageImage: string | null;
  // Step 3: Pricing
  price: string;
  paymentMethod: string;
  // Step 4: Sender Details
  fullName: string;
  identityNumber: string;
  age: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

const TOTAL_STEPS = 4;
const MEETING_POINTS = ['Airport', 'City Center', 'Other'] as const;
const PAYMENT_METHODS = ['Mastercard', 'Visa', 'PayPal', 'Apple Pay'] as const;
const PRICE_CHIPS = [25, 50, 75, 100, 150, 200] as const;
const PHONE_COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+46', country: 'SE' },
  { code: '+81', country: 'JP' },
  { code: '+91', country: 'IN' },
  { code: '+971', country: 'UAE' },
];

/**
 * CreateShipmentScreen - Multi-step form for senders to post shipments
 * 4-step flow: Route → Package → Price → Details
 */
export const CreateShipmentScreen: React.FC = () => {
  const navigation = useNavigation<CreateShipmentScreenNavigationProp>();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ShipmentFormData>({
    originCountryCode: '',
    originCountryName: '',
    originCityId: '',
    originCityName: '',
    meetingPoint: 'Airport',
    destinationAirportCode: '',
    destinationAirportName: '',
    weight: '',
    contents: '',
    packageImage: null,
    price: '50',
    paymentMethod: 'Mastercard',
    fullName: '',
    identityNumber: '',
    age: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
  });

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

  const cityOptions = useMemo((): SelectOption[] => {
    if (!formData.originCountryCode) return [];
    return LocationService.getCitiesByCountry(formData.originCountryCode).map(
      (c) => ({
        id: c.id,
        label: c.name,
      })
    );
  }, [formData.originCountryCode]);

  const airportOptions = useMemo((): SelectOption[] => {
    return LocationService.getAllAirports().map((a) => ({
      id: a.code,
      label: `${a.code} - ${a.name}`,
      sublabel: `${a.city}`,
    }));
  }, []);

  // ============================================
  // HELPERS
  // ============================================
  const updateField = useCallback(
    (field: keyof ShipmentFormData, value: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return 'Set the Route';
      case 2:
        return 'Package Details';
      case 3:
        return 'Set Your Price';
      case 4:
        return 'Finalize Details';
      default:
        return 'Create Shipment';
    }
  };

  // ============================================
  // IMAGE PICKER
  // ============================================
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload a package image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('packageImage', result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Please allow camera access to take a photo of your package.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('packageImage', result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Upload Package Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Library', onPress: handlePickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleClose = () => {
    Alert.alert('Discard Shipment?', 'Your progress will be lost.', [
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
      handlePostShipment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePostShipment = () => {
    console.log('=== Shipment Posted ===');
    console.log(
      'Route:',
      `${formData.originCityName}, ${formData.originCountryName} → ${formData.destinationAirportCode}`
    );
    console.log('Package:', `${formData.weight}kg - ${formData.contents}`);
    console.log('Price:', `$${formData.price} via ${formData.paymentMethod}`);
    console.log('Sender:', formData.fullName);
    console.log(
      'Phone:',
      `${formData.phoneCountryCode} ${formData.phoneNumber}`
    );
    console.log('=======================');

    navigation.navigate('ShipmentDetails', {
      shipment: {
        id: 'new-' + Date.now(),
        route: {
          origin: formData.originCityName || 'New York',
          destination:
            formData.destinationAirportName ||
            formData.destinationAirportCode ||
            'London',
          originCode: 'NYC',
          destinationCode: formData.destinationAirportCode || 'LHR',
        },
        date: 'Oct 26',
        dateRange: 'Oct 26 - Nov 10',
        price: parseInt(formData.price, 10) || 50,
        item: {
          title: 'Package Delivery',
          weight: formData.weight ? `${formData.weight} kg` : '1 kg',
          image: formData.packageImage,
        },
        sender: {
          name: formData.fullName || 'You',
          rating: 5.0,
          avatar: 'YO',
        },
      },
    });
  };

  const handleCountrySelect = (option: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      originCountryCode: option.id,
      originCountryName: option.label,
      originCityId: '',
      originCityName: '',
    }));
  };

  const handleCitySelect = (option: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      originCityId: option.id,
      originCityName: option.label,
    }));
  };

  const handleAirportSelect = (option: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      destinationAirportCode: option.id,
      destinationAirportName: option.label,
    }));
  };

  // ============================================
  // PROGRESS BAR
  // ============================================
  const renderProgressBar = () => (
    <YStack marginBottom="$4">
      <XStack justifyContent="space-between" marginBottom="$2">
        <Text fontSize={RAVEN_TYPOGRAPHY.sm} color={RAVEN_LIGHT.secondaryText}>
          Step {currentStep} of {TOTAL_STEPS}
        </Text>
      </XStack>
      <XStack
        height={4}
        backgroundColor={RAVEN_LIGHT.divider}
        borderRadius={2}
      >
        <YStack
          height={4}
          width={`${(currentStep / TOTAL_STEPS) * 100}%`}
          backgroundColor={RAVEN_LIGHT.primaryText}
          borderRadius={2}
        />
      </XStack>
    </YStack>
  );

  // ============================================
  // STEP 1: ROUTE
  // ============================================
  const renderStep1 = () => (
    <YStack gap={16}>
      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        Origin
      </Text>

      <SearchableSelect
        label="Country"
        placeholder="Select your country"
        value={formData.originCountryName}
        options={countryOptions}
        onSelect={handleCountrySelect}
      />

      <SearchableSelect
        label="City"
        placeholder="Select your city"
        value={formData.originCityName}
        options={cityOptions}
        onSelect={handleCitySelect}
        disabled={!formData.originCountryCode}
      />

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$2"
      >
        Preferred meeting point
      </Text>

      <XStack gap={8} flexWrap="wrap">
        {MEETING_POINTS.map((point) => (
          <TouchableOpacity
            key={point}
            onPress={() => updateField('meetingPoint', point)}
            activeOpacity={0.7}
          >
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius={RAVEN_RADIUS.button}
              borderWidth={1}
              borderColor={
                formData.meetingPoint === point
                  ? RAVEN_LIGHT.primaryText
                  : RAVEN_LIGHT.border
              }
              backgroundColor={
                formData.meetingPoint === point
                  ? RAVEN_LIGHT.inputBackground
                  : 'transparent'
              }
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.primaryText}
                fontWeight={
                  formData.meetingPoint === point
                    ? RAVEN_TYPOGRAPHY.medium
                    : RAVEN_TYPOGRAPHY.regular
                }
              >
                {point}
              </Text>
            </YStack>
          </TouchableOpacity>
        ))}
      </XStack>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$4"
      >
        Destination
      </Text>

      <SearchableSelect
        label="Airport"
        placeholder="Select destination airport"
        value={formData.destinationAirportName}
        options={airportOptions}
        onSelect={handleAirportSelect}
      />
    </YStack>
  );

  // ============================================
  // STEP 2: PACKAGE DETAILS
  // ============================================
  const renderStep2 = () => (
    <YStack gap={16}>
      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        What's the weight of the package?
      </Text>

      <RavenInput
        placeholder="0 Kg"
        value={formData.weight}
        onChangeText={(v: string) => updateField('weight', v)}
        keyboardType="numeric"
      />

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$2"
      >
        What's the content of the package?
      </Text>

      <YStack
        backgroundColor={RAVEN_LIGHT.inputBackground}
        borderRadius={RAVEN_RADIUS.input}
        padding="$3"
        minHeight={120}
      >
        <TextInput
          placeholder="Describe the contents..."
          value={formData.contents}
          onChangeText={(v: string) => updateField('contents', v)}
          style={styles.textArea}
          placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </YStack>

      <Text fontSize={RAVEN_TYPOGRAPHY.xs} color={RAVEN_LIGHT.secondaryText}>
        Raven will not be responsible for any illegal carriages. Please read the
        airport's and international package{' '}
        <Text
          fontWeight={RAVEN_TYPOGRAPHY.semibold}
          color={RAVEN_LIGHT.primaryText}
        >
          policies
        </Text>
        .
      </Text>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$4"
      >
        Picture of the package
      </Text>

      <TouchableOpacity onPress={showImageOptions} activeOpacity={0.7}>
        {formData.packageImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: formData.packageImage }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => updateField('packageImage', null)}
            >
              <Ionicons name="close-circle" size={28} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <YStack
            borderWidth={1}
            borderColor={RAVEN_LIGHT.border}
            borderStyle="dashed"
            borderRadius={RAVEN_RADIUS.card}
            padding="$6"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons
              name="camera-outline"
              size={32}
              color={RAVEN_LIGHT.secondaryText}
            />
            <Text
              fontSize={RAVEN_TYPOGRAPHY.md}
              fontWeight={RAVEN_TYPOGRAPHY.semibold}
              color={RAVEN_LIGHT.primaryText}
              marginTop="$2"
            >
              Upload Photo
            </Text>
            <Text
              fontSize={RAVEN_TYPOGRAPHY.sm}
              color={RAVEN_LIGHT.secondaryText}
            >
              Tap to upload or take a photo
            </Text>
          </YStack>
        )}
      </TouchableOpacity>
    </YStack>
  );

  // ============================================
  // STEP 3: PRICING
  // ============================================
  const renderStep3 = () => (
    <YStack gap={16}>
      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        What's your offer price?
      </Text>

      {/* Price Display */}
      <YStack alignItems="center" paddingVertical="$4">
        <Text
          fontSize={48}
          fontWeight={RAVEN_TYPOGRAPHY.bold}
          color={RAVEN_LIGHT.primaryText}
        >
          ${formData.price}
        </Text>
      </YStack>

      {/* Price Chips */}
      <XStack flexWrap="wrap" gap={8} justifyContent="center">
        {PRICE_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            onPress={() => updateField('price', String(chip))}
            activeOpacity={0.7}
          >
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderRadius={RAVEN_RADIUS.button}
              borderWidth={1}
              borderColor={
                formData.price === String(chip)
                  ? RAVEN_LIGHT.primaryText
                  : RAVEN_LIGHT.border
              }
              backgroundColor={
                formData.price === String(chip)
                  ? RAVEN_LIGHT.primaryText
                  : 'transparent'
              }
              minWidth={70}
              alignItems="center"
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.md}
                color={
                  formData.price === String(chip)
                    ? RAVEN_LIGHT.background
                    : RAVEN_LIGHT.primaryText
                }
                fontWeight={
                  formData.price === String(chip)
                    ? RAVEN_TYPOGRAPHY.semibold
                    : RAVEN_TYPOGRAPHY.regular
                }
              >
                ${chip}
              </Text>
            </YStack>
          </TouchableOpacity>
        ))}
      </XStack>

      {/* Custom Price Input */}
      <RavenInput
        label="Or enter custom amount"
        placeholder="Enter amount"
        value={formData.price}
        onChangeText={(v: string) => updateField('price', v)}
        keyboardType="numeric"
      />

      <Text fontSize={RAVEN_TYPOGRAPHY.xs} color={RAVEN_LIGHT.secondaryText}>
        This is the amount the Raven (traveler) will receive for this delivery.
      </Text>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$4"
      >
        Payment method
      </Text>

      <XStack flexWrap="wrap" gap={8}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => updateField('paymentMethod', method)}
            activeOpacity={0.7}
          >
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius={RAVEN_RADIUS.button}
              borderWidth={1}
              borderColor={
                formData.paymentMethod === method
                  ? RAVEN_LIGHT.primaryText
                  : RAVEN_LIGHT.border
              }
              backgroundColor={
                formData.paymentMethod === method
                  ? RAVEN_LIGHT.inputBackground
                  : 'transparent'
              }
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.primaryText}
                fontWeight={
                  formData.paymentMethod === method
                    ? RAVEN_TYPOGRAPHY.medium
                    : RAVEN_TYPOGRAPHY.regular
                }
              >
                {method}
              </Text>
            </YStack>
          </TouchableOpacity>
        ))}
      </XStack>
    </YStack>
  );

  // ============================================
  // STEP 4: FINALIZE DETAILS
  // ============================================
  const renderStep4 = () => (
    <YStack gap={16}>
      <Text
        fontSize={RAVEN_TYPOGRAPHY.sm}
        color={RAVEN_LIGHT.secondaryText}
        marginBottom="$2"
      >
        Enter full details about you (sender) so that we can finalize this
        transaction securely:
      </Text>

      <RavenInput
        label="Full name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChangeText={(v: string) => updateField('fullName', v)}
        autoCapitalize="words"
      />

      <RavenInput
        label="Identity Number"
        placeholder="Passport or ID number"
        value={formData.identityNumber}
        onChangeText={(v: string) => updateField('identityNumber', v)}
      />

      <RavenInput
        label="Age"
        placeholder="Your age"
        value={formData.age}
        onChangeText={(v: string) => updateField('age', v)}
        keyboardType="numeric"
      />

      {/* Phone Input with Country Code */}
      <Text
        fontSize={RAVEN_TYPOGRAPHY.sm}
        fontWeight={RAVEN_TYPOGRAPHY.medium}
        color={RAVEN_LIGHT.primaryText}
        marginBottom={4}
      >
        Phone Number
      </Text>

      <XStack gap={8}>
        {/* Country Code Picker */}
        <View style={styles.countryCodeContainer}>
          <TouchableOpacity
            style={styles.countryCodeButton}
            onPress={() => {
              Alert.alert(
                'Select Country Code',
                undefined,
                PHONE_COUNTRY_CODES.map((item) => ({
                  text: `${item.code} (${item.country})`,
                  onPress: () => updateField('phoneCountryCode', item.code),
                }))
              );
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.countryCodeText}>
              {formData.phoneCountryCode}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={RAVEN_LIGHT.secondaryText}
            />
          </TouchableOpacity>
        </View>

        {/* Phone Number Input */}
        <View style={styles.phoneInputContainer}>
          <TextInput
            style={styles.phoneInput}
            placeholder="000-000-0000"
            placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
            value={formData.phoneNumber}
            onChangeText={(v: string) => updateField('phoneNumber', v)}
            keyboardType="phone-pad"
          />
        </View>
      </XStack>
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
        {/* Close/Back Button */}
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

        {/* Title */}
        <Text
          fontSize={RAVEN_TYPOGRAPHY.lg}
          fontWeight={RAVEN_TYPOGRAPHY.semibold}
          color={RAVEN_LIGHT.primaryText}
        >
          {getStepTitle()}
        </Text>
      </XStack>

      <ScrollView
        flex={1}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} paddingHorizontal={RAVEN_SPACING.screenPadding}>
          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Spacer */}
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
          {currentStep === TOTAL_STEPS ? 'Post Shipment' : 'Next'}
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
  textArea: {
    backgroundColor: 'transparent',
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    minHeight: 100,
    padding: 0,
  },
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
  countryCodeContainer: {
    width: 90,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
  },
  countryCodeText: {
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    backgroundColor: RAVEN_LIGHT.inputBackground,
    borderRadius: RAVEN_RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: RAVEN_TYPOGRAPHY.md,
    color: RAVEN_LIGHT.primaryText,
    borderWidth: 1,
    borderColor: RAVEN_LIGHT.border,
  },
});
