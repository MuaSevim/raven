import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import tamaguiConfig from './src/config/tamagui.config';
import { RAVEN_LIGHT } from './src/config/theme.config';
import {
  LoginScreen,
  SignUpScreen,
  VerificationScreen,
  WelcomeScreen,
  TravelerFeedScreen,
  ShipmentDetailsScreen,
  CreateShipmentScreen,
} from './src/screens';
import { Shipment } from './src/data/mockData';

// ============================================
// NAVIGATION TYPES
// ============================================
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Verification: undefined;
  Welcome: undefined;
  TravelerFeed: undefined;
  ShipmentDetails: { shipment: Shipment };
  CreateShipment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={RAVEN_LIGHT.background} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: RAVEN_LIGHT.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="TravelerFeed" component={TravelerFeedScreen} />
            <Stack.Screen 
              name="ShipmentDetails" 
              component={ShipmentDetailsScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen 
              name="CreateShipment" 
              component={CreateShipmentScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
