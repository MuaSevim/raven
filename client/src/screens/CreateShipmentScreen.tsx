import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { YStack, XStack, Text, ScrollView, TextArea } from 'tamagui';
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
import { RavenInput, RavenButton } from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type CreateShipmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateShipment'>;

// ============================================
// TYPES
// ============================================
interface ShipmentFormData {
  // Step 1: Route
  originCountry: string;
  originCity: string;
  meetingPoint: 'Airport' | 'City Center' | 'Other';
  destinationAirport: string;
  // Step 2: Package Details
  weight: string;
  contents: string;
  // Step 3: Date (skipped for simplicity, using dateRange)
  dateRange: string;
  // Step 4: Pricing
  price: string;
  paymentMethod: string;
  // Step 5: Sender Details
  fullName: string;
  identityNumber: string;
  age: string;
  phoneNumber: string;
}

const TOTAL_STEPS = 5;
const MEETING_POINTS = ['Airport', 'City Center', 'Other'] as const;
const PAYMENT_METHODS = ['Mastercard', 'American Express', 'Paypal', 'Swish'] as const;

/**
 * CreateShipmentScreen - Multi-step form for senders to post shipments
 * 5-step flow: Route → Package → Date → Price → Details
 */
export const CreateShipmentScreen: React.FC = () => {
  const navigation = useNavigation<CreateShipmentScreenNavigationProp>();

  // Current step (1-5)
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState<ShipmentFormData>({
    originCountry: '',
    originCity: '',
    meetingPoint: 'Airport',
    destinationAirport: '',
    weight: '',
    contents: '',
    dateRange: '',
    price: '50',
    paymentMethod: 'Mastercard',
    fullName: '',
    identityNumber: '',
    age: '',
    phoneNumber: '',
  });

  // ============================================
  // HELPERS
  // ============================================
  const updateField = (field: keyof ShipmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1: return 'Set the Route';
      case 2: return 'Package Details';
      case 3: return 'Set Your Price';
      case 4: return 'Set Your Price';
      case 5: return 'Finalize Details';
      default: return 'Create Shipment';
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleClose = () => {
    Alert.alert(
      'Discard Shipment?',
      'Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handlePostShipment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePostShipment = () => {
    // Log the shipment data
    console.log('=== Shipment Posted ===');
    console.log('Route:', `${formData.originCity}, ${formData.originCountry} → ${formData.destinationAirport}`);
    console.log('Package:', `${formData.weight}kg - ${formData.contents}`);
    console.log('Price:', `$${formData.price} via ${formData.paymentMethod}`);
    console.log('Sender:', formData.fullName);
    console.log('=======================');

    // Navigate to success/details view
    navigation.navigate('ShipmentDetails', {
      shipment: {
        id: 'new-' + Date.now(),
        route: {
          origin: formData.originCity || 'New York',
          destination: formData.destinationAirport || 'London',
          originCode: 'NYC',
          destinationCode: 'LHR',
        },
        date: 'Oct 26',
        dateRange: 'Oct 26 - Nov 10',
        price: parseInt(formData.price) || 50,
        item: {
          title: 'Package Delivery',
          weight: formData.weight || '1 kg',
          image: null,
        },
        sender: {
          name: formData.fullName || 'You',
          rating: 5.0,
          avatar: 'YO',
        },
      },
    });
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
        {currentStep >= 3 && (
          <Text fontSize={RAVEN_TYPOGRAPHY.sm} color={RAVEN_LIGHT.secondaryText}>
            {currentStep}/{TOTAL_STEPS}
          </Text>
        )}
      </XStack>
      <XStack height={4} backgroundColor={RAVEN_LIGHT.divider} borderRadius={2}>
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
    <YStack space="$4">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        Origin
      </Text>

      <RavenInput
        placeholder="Select your country"
        value={formData.originCountry}
        onChangeText={(v: string) => updateField('originCountry', v)}
      />

      <RavenInput
        placeholder="Select your city"
        value={formData.originCity}
        onChangeText={(v: string) => updateField('originCity', v)}
      />

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$2"
      >
        Preferred meeting point
      </Text>

      <XStack space="$2" flexWrap="wrap">
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
              borderColor={formData.meetingPoint === point ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.border}
              backgroundColor={formData.meetingPoint === point ? RAVEN_LIGHT.inputBackground : 'transparent'}
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.primaryText}
                fontWeight={formData.meetingPoint === point ? RAVEN_TYPOGRAPHY.medium : RAVEN_TYPOGRAPHY.regular}
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

      <RavenInput
        placeholder="Select airport"
        value={formData.destinationAirport}
        onChangeText={(v: string) => updateField('destinationAirport', v)}
      />
    </YStack>
  );

  // ============================================
  // STEP 2: PACKAGE DETAILS
  // ============================================
  const renderStep2 = () => (
    <YStack space="$4">
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
        <TextArea
          placeholder="Describe the contents..."
          value={formData.contents}
          onChangeText={(v: string) => updateField('contents', v)}
          backgroundColor="transparent"
          borderWidth={0}
          fontSize={RAVEN_TYPOGRAPHY.md}
          color={RAVEN_LIGHT.primaryText}
          placeholderTextColor={RAVEN_LIGHT.inputPlaceholder}
          minHeight={100}
        />
      </YStack>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.xs}
        color={RAVEN_LIGHT.secondaryText}
      >
        Raven will not be responsible for any illegal carriages, for further details please read the airport's and international package{' '}
        <Text fontWeight={RAVEN_TYPOGRAPHY.semibold} color={RAVEN_LIGHT.primaryText}>
          policies
        </Text>.
      </Text>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$4"
      >
        Picture of the package
      </Text>

      <TouchableOpacity activeOpacity={0.7}>
        <YStack
          borderWidth={1}
          borderColor={RAVEN_LIGHT.border}
          borderStyle="dashed"
          borderRadius={RAVEN_RADIUS.card}
          padding="$6"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize={RAVEN_TYPOGRAPHY.md}
            fontWeight={RAVEN_TYPOGRAPHY.semibold}
            color={RAVEN_LIGHT.primaryText}
            marginBottom="$1"
          >
            Upload
          </Text>
          <Text
            fontSize={RAVEN_TYPOGRAPHY.sm}
            color={RAVEN_LIGHT.secondaryText}
          >
            Tap to upload a picture of the package
          </Text>
        </YStack>
      </TouchableOpacity>
    </YStack>
  );

  // ============================================
  // STEP 3 & 4: PRICING
  // ============================================
  const renderStep3 = () => (
    <YStack space="$4">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
      >
        What's your offer price?
      </Text>

      <YStack>
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text fontSize={RAVEN_TYPOGRAPHY.sm} color={RAVEN_LIGHT.secondaryText}>
            $10 - $90
          </Text>
          <Text fontSize={RAVEN_TYPOGRAPHY.md} fontWeight={RAVEN_TYPOGRAPHY.semibold} color={RAVEN_LIGHT.primaryText}>
            ${formData.price}
          </Text>
        </XStack>
        
        {/* Slider placeholder - using text input for now */}
        <YStack
          height={4}
          backgroundColor={RAVEN_LIGHT.divider}
          borderRadius={2}
          marginBottom="$2"
        >
          <YStack
            height={4}
            width={`${((parseInt(formData.price) || 50) / 90) * 100}%`}
            backgroundColor={RAVEN_LIGHT.primaryText}
            borderRadius={2}
          />
        </YStack>

        <RavenInput
          placeholder="Enter amount"
          value={formData.price}
          onChangeText={(v: string) => updateField('price', v)}
          keyboardType="numeric"
        />
      </YStack>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.xs}
        color={RAVEN_LIGHT.secondaryText}
      >
        This is the amount the Raven (traveler) will receive for this delivery.
      </Text>

      <Text
        fontSize={RAVEN_TYPOGRAPHY.md}
        fontWeight={RAVEN_TYPOGRAPHY.semibold}
        color={RAVEN_LIGHT.primaryText}
        marginTop="$4"
      >
        What will be your app-in payment method?
      </Text>

      <XStack flexWrap="wrap" gap="$2">
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
              borderColor={formData.paymentMethod === method ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.border}
              backgroundColor={formData.paymentMethod === method ? RAVEN_LIGHT.inputBackground : 'transparent'}
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.primaryText}
                fontWeight={formData.paymentMethod === method ? RAVEN_TYPOGRAPHY.medium : RAVEN_TYPOGRAPHY.regular}
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
  // STEP 5: FINALIZE DETAILS
  // ============================================
  const renderStep5 = () => (
    <YStack space="$4">
      <Text
        fontSize={RAVEN_TYPOGRAPHY.sm}
        color={RAVEN_LIGHT.secondaryText}
        marginBottom="$2"
      >
        Enter full details about you (sender) so that we can finalize this transaction securely:
      </Text>

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

      <RavenInput
        label="Phone Number"
        placeholder="(000) 000-00-00"
        value={formData.phoneNumber}
        onChangeText={(v: string) => updateField('phoneNumber', v)}
        keyboardType="phone-pad"
      />
    </YStack>
  );

  // ============================================
  // RENDER CURRENT STEP
  // ============================================
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3:
      case 4: return renderStep3();
      case 5: return renderStep5();
      default: return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      {/* ========== HEADER ========== */}
      <XStack
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        paddingVertical="$3"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={handleClose}
          style={{ position: 'absolute', left: 20, padding: 4 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={RAVEN_LIGHT.primaryText} />
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
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          flex={1}
          paddingHorizontal={RAVEN_SPACING.screenPadding}
        >
          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Spacer */}
          <YStack flex={1} minHeight="$4" />
        </YStack>
      </ScrollView>

      {/* ========== STICKY FOOTER ========== */}
      <YStack
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        paddingVertical="$4"
        backgroundColor={RAVEN_LIGHT.background}
      >
        <RavenButton onPress={handleNext}>
          {currentStep === TOTAL_STEPS ? 'Post' : 'Next'}
        </RavenButton>
      </YStack>
    </SafeAreaView>
  );
};
