import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, View, Text } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import tamaguiConfig, { RAVEN_COLORS } from './src/config/tamagui.config';
import { LoginScreen } from './src/screens/LoginScreen';

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
        <StatusBar style="light" backgroundColor={RAVEN_COLORS.background} />
        <LoginScreen />
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
