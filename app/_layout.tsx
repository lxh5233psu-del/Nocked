import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Exo2_400Regular,
  Exo2_500Medium,
  Exo2_600SemiBold,
  Exo2_700Bold,
  Exo2_800ExtraBold,
  Exo2_900Black,
} from '@expo-google-fonts/exo-2';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Exo2_400Regular,
    Exo2_500Medium,
    Exo2_600SemiBold,
    Exo2_700Bold,
    Exo2_800ExtraBold,
    Exo2_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.welcomeBg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bgPrimary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{ contentStyle: { backgroundColor: Colors.welcomeBg } }}
        />
        <Stack.Screen name="home/index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="setup/index" />
        <Stack.Screen name="form/index" />
        <Stack.Screen name="tuning/index" />
        <Stack.Screen name="scoring/index" />
        <Stack.Screen name="shot-analyzer/index" />
        <Stack.Screen name="settings/index" />
      </Stack>
    </>
  );
}
