import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RAVEN_COLORS } from '../config/tamagui.config';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuth } from '../hooks/useAuth';
import { YStack, Spinner, Text } from 'tamagui';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom dark theme for navigation
const RavenNavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: RAVEN_COLORS.primaryAccent,
    background: RAVEN_COLORS.background,
    card: RAVEN_COLORS.cardSurface,
    text: RAVEN_COLORS.textPrimary,
    border: RAVEN_COLORS.border,
    notification: RAVEN_COLORS.primaryAccent,
  },
};

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$ravenBackground">
        <Spinner size="large" color="$ravenPrimary" />
        <Text color="$ravenTextSecondary" marginTop="$4">Loading...</Text>
      </YStack>
    );
  }

  return (
    <NavigationContainer theme={RavenNavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
