import React from 'react';
import { TouchableOpacity, Alert, ScrollView } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
import { RavenButton } from '../components';

// Types
import { Shipment } from '../data/mockData';
import { RootStackParamList } from '../../App';

type ShipmentDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShipmentDetails'>;
type ShipmentDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ShipmentDetails'>;

/**
 * ShipmentDetailsScreen - View full details of a shipment
 * Travelers use this to decide whether to make an offer
 */
export const ShipmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ShipmentDetailsScreenNavigationProp>();
  const route = useRoute<ShipmentDetailsScreenRouteProp>();
  
  // Get shipment from navigation params
  const { shipment } = route.params;
  const { route: shipmentRoute, price, item, sender, dateRange } = shipment;

  // ============================================
  // HANDLERS
  // ============================================
  const handleClose = () => {
    navigation.goBack();
  };

  const handleMakeOffer = () => {
    Alert.alert(
      'Offer Submitted!',
      `You've expressed interest in delivering this package from ${shipmentRoute.origin} to ${shipmentRoute.destination} for $${price}.`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleMessageSender = () => {
    // Navigate to Chat screen (when implemented)
    Alert.alert('Chat', `Starting conversation with ${sender.name}...`);
    // navigation.navigate('Chat', { senderId: sender.name });
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const renderInfoRow = (
    icon: keyof typeof Ionicons.glyphMap,
    primary: string,
    secondary?: string
  ) => (
    <XStack alignItems="center" space="$3" paddingVertical="$3">
      <YStack
        width={40}
        height={40}
        borderRadius={RAVEN_RADIUS.sm}
        backgroundColor={RAVEN_LIGHT.inputBackground}
        alignItems="center"
        justifyContent="center"
      >
        <Ionicons name={icon} size={20} color={RAVEN_LIGHT.secondaryText} />
      </YStack>
      <YStack flex={1}>
        <Text
          fontSize={RAVEN_TYPOGRAPHY.md}
          fontWeight={RAVEN_TYPOGRAPHY.medium}
          color={RAVEN_LIGHT.primaryText}
        >
          {primary}
        </Text>
        {secondary && (
          <Text
            fontSize={RAVEN_TYPOGRAPHY.sm}
            color={RAVEN_LIGHT.secondaryText}
          >
            {secondary}
          </Text>
        )}
      </YStack>
    </XStack>
  );

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
          Delivery Posted!
        </Text>
      </XStack>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack
          flex={1}
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingTop="$2"
        >
          {/* ========== ROUTE DETAILS ========== */}
          {renderInfoRow(
            'location-outline',
            `${shipmentRoute.origin}, USA`,
            '123 Main St, ' + shipmentRoute.origin
          )}
          
          {renderInfoRow(
            'location-outline',
            `${shipmentRoute.destination}, UK`,
            '456 High St, ' + shipmentRoute.destination
          )}

          {/* ========== DATE RANGE ========== */}
          {renderInfoRow('calendar-outline', dateRange)}

          {/* ========== PRICE & PAYMENT ========== */}
          {renderInfoRow('cash-outline', `$${price}.00 - Mastercard`)}

          {/* ========== SENDER INFO ========== */}
          {renderInfoRow('person-outline', sender.name)}

          {/* Spacer */}
          <YStack flex={1} />
        </YStack>
      </ScrollView>

      {/* ========== STICKY FOOTER ========== */}
      <YStack
        paddingHorizontal={RAVEN_SPACING.screenPadding}
        paddingVertical="$4"
        backgroundColor={RAVEN_LIGHT.background}
        borderTopWidth={1}
        borderTopColor={RAVEN_LIGHT.border}
      >
        <RavenButton onPress={handleClose}>
          Done
        </RavenButton>
      </YStack>
    </SafeAreaView>
  );
};
