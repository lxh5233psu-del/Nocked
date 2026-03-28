import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Exo2_300Light,
  Exo2_400Regular,
  Exo2_600SemiBold,
} from '@expo-google-fonts/exo-2';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Exo2_300Light,
    Exo2_400Regular,
    Exo2_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <StatusBar style="light" backgroundColor={Colors.bgPrimary} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="form" />
        <Stack.Screen name="tuning" />
        <Stack.Screen name="scoring" />
        <Stack.Screen name="shot-analyzer" />
        <Stack.Screen name="settings" />
      </Stack>
    </GestureHandlerRootView>
  );
}
