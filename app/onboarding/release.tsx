import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { SelectOption } from '@/components/ui/SelectOption';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { ReleaseType } from '@/types';
import { Spacing } from '@/constants/theme';

const RELEASE_TYPES: { label: string; value: ReleaseType; description: string }[] = [
  { label: 'Wrist Strap', value: 'Wrist strap', description: 'Index finger trigger' },
  { label: 'Thumb Button', value: 'Thumb button', description: 'Thumb-activated trigger' },
  { label: 'Hinge', value: 'Hinge', description: 'Rotation-activated' },
  { label: 'Back Tension', value: 'Back tension', description: 'Back tension activation' },
  { label: 'Other', value: 'Other', description: '' },
];

export default function ReleaseScreen() {
  const setReleaseProfile = useAppStore((s) => s.setReleaseProfile);
  const existing = useAppStore((s) => s.releaseProfile);

  const [releaseType, setReleaseType] = useState<ReleaseType | null>(existing?.type ?? null);
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [model, setModel] = useState(existing?.model ?? '');

  const handleContinue = () => {
    if (!releaseType) return;
    setReleaseProfile({ type: releaseType, brand: brand || undefined, model: model || undefined });
    router.push('/onboarding/setup-check');
  };

  return (
    <OnboardingLayout
      step={6}
      totalSteps={8}
      title="Release"
      subtitle="Your release type determines which anchor and release technique instructions you'll see."
    >
      <View style={styles.options}>
        {RELEASE_TYPES.map((r) => (
          <SelectOption
            key={r.value}
            label={r.label}
            selected={releaseType === r.value}
            onPress={() => setReleaseType(r.value)}
          />
        ))}
      </View>

      <View style={styles.row}>
        <TextInput
          label="Brand"
          value={brand}
          onChangeText={setBrand}
          placeholder="e.g. Carter, Scott"
          optional
          style={styles.halfField}
        />
        <TextInput
          label="Model"
          value={model}
          onChangeText={setModel}
          placeholder="e.g. Wise Choice"
          optional
          style={styles.halfField}
        />
      </View>

      <View style={styles.actions}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={releaseType === null}
        />
        <Button
          label="Skip for Now"
          variant="ghost"
          onPress={() => router.push('/onboarding/setup-check')}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  halfField: {
    flex: 1,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
