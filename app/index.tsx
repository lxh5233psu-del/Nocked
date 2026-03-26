import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/(home)');
    } else {
      router.replace('/onboarding/welcome');
    }
  }, [isOnboarded]);

  return null;
}
