import React from 'react';
import { TouchableOpacity, ScrollView, Image } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Design System
import {
  RAVEN_LIGHT,
  RAVEN_ASSETS,
  RAVEN_TYPOGRAPHY,
  RAVEN_SPACING,
  RAVEN_RADIUS,
} from '../config/theme.config';

// Reusable Components
import { RavenButton, TabBar } from '../components';

// Navigation Types
import { RootStackParamList } from '../../App';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

// ============================================
// ROLE CARD COMPONENT (Inline - used only here)
// ============================================
interface RoleCardProps {
  image: any;
  title: string;
  subtitle: string;
  onPress: () => void;
  highlighted?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({
  image,
  title,
  subtitle,
  onPress,
  highlighted = false,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <YStack
      backgroundColor="#F8F8F8"
      borderRadius={RAVEN_RADIUS.card}
      overflow="hidden"
      borderWidth={highlighted ? 2 : 1}
      borderColor={highlighted ? RAVEN_LIGHT.primaryText : RAVEN_LIGHT.border}
    >
      {/* Image */}
      <Image
        source={image}
        style={{ width: '100%', height: 160 }}
        resizeMode="cover"
      />

      {/* Text Content */}
      <YStack padding="$4">
        <Text
          fontSize={RAVEN_TYPOGRAPHY.lg}
          fontWeight={highlighted ? RAVEN_TYPOGRAPHY.bold : RAVEN_TYPOGRAPHY.semibold}
          color={RAVEN_LIGHT.primaryText}
          marginBottom="$1"
        >
          {title}
        </Text>
        <Text
          fontSize={RAVEN_TYPOGRAPHY.sm}
          color={RAVEN_LIGHT.secondaryText}
        >
          {subtitle}
        </Text>
      </YStack>
    </YStack>
  </TouchableOpacity>
);

/**
 * WelcomeScreen - Role Selection after signup
 * Users choose between "Send" or "Travel" paths
 */
export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleSendPath = () => {
    // Navigate to Flight Search - Senders find Travelers
    navigation.navigate('FlightSearch');
  };

  const handleTravelPath = () => {
    // Navigate to Traveler Feed - View available deliveries first
    navigation.navigate('TravelerFeed');
  };

  const handleExploreMore = () => {
    // Future: Navigate to onboarding or feature tour
    console.log('Explore more of Raven');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_LIGHT.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack
          flex={1}
          paddingHorizontal={RAVEN_SPACING.screenPadding}
          paddingTop="$4"
          paddingBottom="$6"
        >
          {/* ========== HEADER ========== */}
          <Text
            fontSize={RAVEN_TYPOGRAPHY.xl}
            fontWeight={RAVEN_TYPOGRAPHY.semibold}
            color={RAVEN_LIGHT.primaryText}
            textAlign="center"
            marginBottom="$6"
          >
            Welcome to Raven
          </Text>

          {/* ========== ROLE CARDS ========== */}
          <YStack space="$4" flex={1}>
            {/* Option 1: Travel (Primary Focus) */}
            <RoleCard
              image={RAVEN_ASSETS.backpackShot}
              title="Travel while making money"
              subtitle="Earn by delivering packages on your trips"
              onPress={handleTravelPath}
              highlighted
            />

            {/* Option 2: Send */}
            <RoleCard
              image={RAVEN_ASSETS.packageShot}
              title="Send your packages reliably for cheap!"
              subtitle="Connect with travelers to send your items"
              onPress={handleSendPath}
            />
          </YStack>

          {/* ========== EXPLORE BUTTON ========== */}
          <YStack paddingTop="$6">
            <RavenButton variant="outline" onPress={handleExploreMore}>
              Explore more of Raven
            </RavenButton>
          </YStack>
        </YStack>
      </ScrollView>

      {/* ========== BOTTOM TAB BAR ========== */}
      <TabBar
        items={[
          { icon: 'home', label: 'Home', active: true },
          { icon: 'add-circle', label: 'Deliveries' },
          { icon: 'location', label: 'Trips' },
          { icon: 'person', label: 'Profile' },
        ]}
      />
    </SafeAreaView>
  );
};
