import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RAVEN_COLORS, RAVEN_RADIUS } from '../config/tamagui.config';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RAVEN_COLORS.background }} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack flex={1} padding="$4" space="$4">
          {/* Welcome Section */}
          <YStack space="$2" marginBottom="$4">
            <Text fontSize={14} color="$ravenTextSecondary" letterSpacing={1}>
              WELCOME BACK
            </Text>
            <Text fontSize={28} fontWeight="800" color="$ravenTextPrimary">
              Ready to Deliver?
            </Text>
          </YStack>

          {/* Quick Stats Cards */}
          <XStack space="$3" flexWrap="wrap">
            <Card
              flex={1}
              minWidth={150}
              backgroundColor="$ravenCard"
              borderRadius={RAVEN_RADIUS.card}
              padding="$4"
              borderWidth={1}
              borderColor="$ravenBorder"
            >
              <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
                ACTIVE DELIVERIES
              </Text>
              <Text fontSize={32} fontWeight="800" color="$ravenPrimary" marginTop="$2">
                0
              </Text>
            </Card>
            
            <Card
              flex={1}
              minWidth={150}
              backgroundColor="$ravenCard"
              borderRadius={RAVEN_RADIUS.card}
              padding="$4"
              borderWidth={1}
              borderColor="$ravenBorder"
            >
              <Text fontSize={12} color="$ravenTextSecondary" fontWeight="600">
                COMPLETED
              </Text>
              <Text fontSize={32} fontWeight="800" color="$ravenSuccess" marginTop="$2">
                0
              </Text>
            </Card>
          </XStack>

          {/* Quick Actions */}
          <YStack space="$3" marginTop="$4">
            <Text fontSize={14} color="$ravenTextSecondary" fontWeight="600" letterSpacing={1}>
              QUICK ACTIONS
            </Text>
            
            <Button
              size="$5"
              height={60}
              backgroundColor="$ravenPrimary"
              borderRadius={RAVEN_RADIUS.button}
              pressStyle={{
                backgroundColor: RAVEN_COLORS.primaryAccentDark,
              }}
            >
              <YStack alignItems="center">
                <Text color="$ravenTextPrimary" fontWeight="600" fontSize={16}>
                  FIND A DELIVERY
                </Text>
                <Text color="$ravenTextPrimary" fontSize={12} opacity={0.8}>
                  Browse available tasks near you
                </Text>
              </YStack>
            </Button>

            <Button
              size="$5"
              height={60}
              backgroundColor="$ravenCard"
              borderRadius={RAVEN_RADIUS.button}
              borderWidth={1}
              borderColor="$ravenBorder"
              pressStyle={{
                backgroundColor: RAVEN_COLORS.surfacePressed,
              }}
            >
              <YStack alignItems="center">
                <Text color="$ravenTextPrimary" fontWeight="600" fontSize={16}>
                  POST A REQUEST
                </Text>
                <Text color="$ravenTextSecondary" fontSize={12}>
                  Need something delivered?
                </Text>
              </YStack>
            </Button>
          </YStack>

          {/* Recent Activity */}
          <YStack space="$3" marginTop="$4">
            <Text fontSize={14} color="$ravenTextSecondary" fontWeight="600" letterSpacing={1}>
              RECENT ACTIVITY
            </Text>
            
            <Card
              backgroundColor="$ravenCard"
              borderRadius={RAVEN_RADIUS.card}
              padding="$4"
              borderWidth={1}
              borderColor="$ravenBorder"
            >
              <YStack alignItems="center" paddingVertical="$6">
                <Text color="$ravenTextSecondary" fontSize={14}>
                  No recent activity
                </Text>
                <Text color="$ravenTextSecondary" fontSize={12} marginTop="$1">
                  Your deliveries will appear here
                </Text>
              </YStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};
