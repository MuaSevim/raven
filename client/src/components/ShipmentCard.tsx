import React from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Image } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_TYPOGRAPHY,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Types
import { Shipment } from '../data/mockData';

// ============================================
// PROPS
// ============================================
interface ShipmentCardProps {
  shipment: Shipment;
  onPress?: () => void;
}

/**
 * ShipmentCard - Displays a single shipment listing
 * Used in TravelerFeedScreen to show available deliveries
 */
export const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, onPress }) => {
  const { route, dateRange, price, item, sender } = shipment;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <YStack
        backgroundColor={RAVEN_LIGHT.background}
        borderRadius={RAVEN_RADIUS.card}
        padding="$4"
        marginBottom="$3"
        borderWidth={1}
        borderColor={RAVEN_LIGHT.border}
      >
        {/* ========== ROW 1: Route & Image ========== */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          {/* Left: Route Info */}
          <YStack flex={1} paddingRight="$3">
            {/* Route */}
            <XStack alignItems="center" marginBottom="$1">
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.secondaryText}
              >
                {route.origin}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={RAVEN_LIGHT.secondaryText}
                style={{ marginHorizontal: 6 }}
              />
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                color={RAVEN_LIGHT.secondaryText}
              >
                {route.destination}
              </Text>
            </XStack>

            {/* Item Title */}
            <Text
              fontSize={RAVEN_TYPOGRAPHY.md}
              fontWeight={RAVEN_TYPOGRAPHY.semibold}
              color={RAVEN_LIGHT.primaryText}
              marginBottom="$1"
            >
              {item.title}
            </Text>

            {/* Date Range */}
            <Text
              fontSize={RAVEN_TYPOGRAPHY.sm}
              color={RAVEN_LIGHT.secondaryText}
              marginBottom="$2"
            >
              {dateRange}
            </Text>

            {/* Price Badge */}
            <YStack
              backgroundColor={RAVEN_LIGHT.inputBackground}
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius={RAVEN_RADIUS.sm}
              alignSelf="flex-start"
            >
              <Text
                fontSize={RAVEN_TYPOGRAPHY.sm}
                fontWeight={RAVEN_TYPOGRAPHY.semibold}
                color={RAVEN_LIGHT.primaryText}
              >
                ${price}
              </Text>
            </YStack>
          </YStack>

          {/* Right: City Image */}
          <YStack
            width={100}
            height={80}
            borderRadius={RAVEN_RADIUS.sm}
            backgroundColor={RAVEN_LIGHT.inputBackground}
            overflow="hidden"
          >
            {/* Placeholder city skyline image */}
            <Image
              source={{ uri: `https://picsum.photos/200/160?random=${shipment.id}` }}
              width={100}
              height={80}
              resizeMode="cover"
            />
          </YStack>
        </XStack>
      </YStack>
    </TouchableOpacity>
  );
};
