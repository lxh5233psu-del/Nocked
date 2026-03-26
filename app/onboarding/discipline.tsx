import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { SelectOption } from '@/components/ui/SelectOption';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { Discipline } from '@/types';
import { Spacing } from '@/constants/theme';

const DISCIPLINES: { label: string; value: Discipline; description: string }[] = [
  {
    label: 'Target / 3D',
    value: 'Target/3D',
    description: 'Competitive target archery, 3D courses, indoor rounds',
  },
  {
    label: 'Bowhunting',
    value: 'Bowhunting',
    description: 'Hunting applications, field use, broadhead tuning',
  },
  {
    label: 'Both',
    value: 'Both',
    description: 'Full coverage — target and hunting setups',
  },
];

export default function DisciplineScreen() {
  const setDiscipline = useAppStore((s) => s.setDiscipline);
  const existing = useAppStore((s) => s.discipline);
  const [selected, setSelected] = useState<Discipline | null>(existing);

  const handleContinue = () => {
    if (!selected) return;
    setDiscipline(selected);
    router.push('/onboarding/tools');
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={8}
      title="Your Discipline"
      subtitle="This shapes the content and priorities shown throughout tuning and coaching."
    >
      <View style={styles.options}>
        {DISCIPLINES.map((d) => (
          <SelectOption
            key={d.value}
            label={d.label}
            selected={selected === d.value}
            onPress={() => setSelected(d.value)}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={selected === null}
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
  actions: {
    marginTop: Spacing.md,
  },
});
