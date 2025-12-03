import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { YStack, Spinner, Text } from 'tamagui';

import tamaguiConfig, { RAVEN_COLORS } from './src/config/tamagui.config';
import { RootNavigator } from './src/navigation';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Load Inter font family
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Show loading while fonts are loading
  if (!appIsReady) {
    return (
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor={RAVEN_COLORS.background}
        >
          <Spinner size="large" color={RAVEN_COLORS.primaryAccent} />
        </YStack>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={RAVEN_COLORS.background} />
        <RootNavigator />
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
