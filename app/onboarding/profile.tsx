import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { TextInput } from '@/components/ui/TextInput';
import { SelectOption } from '@/components/ui/SelectOption';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { Handedness, ExperienceLevel } from '@/types';
import { Colors, Spacing, Typography, FontSizes } from '@/constants/theme';
import { Text } from 'react-native';

const HANDEDNESS: { label: string; value: Handedness }[] = [
  { label: 'Right Handed', value: 'RH' },
  { label: 'Left Handed', value: 'LH' },
];

const EXPERIENCE: { label: string; value: ExperienceLevel }[] = [
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Pro / Coach', value: 'Pro/Coach' },
];

export default function ProfileScreen() {
  const setArcherProfile = useAppStore((s) => s.setArcherProfile);
  const existing = useAppStore((s) => s.archerProfile);

  const [name, setName] = useState(existing?.name ?? '');
  const [handedness, setHandedness] = useState<Handedness | null>(existing?.handedness ?? null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(existing?.experience ?? null);

  const canContinue = handedness !== null && experience !== null;

  const handleContinue = () => {
    if (!handedness || !experience) return;
    setArcherProfile({ name, handedness, experience });
    router.push('/onboarding/discipline');
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={8}
      title="Archer Profile"
      subtitle="Tell us a little about yourself. This personalizes every instruction throughout the app."
      showBack={false}
    >
      {/* Name */}
      <TextInput
        label="Your Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Jordan"
        optional
        returnKeyType="done"
        style={styles.field}
      />

      {/* Handedness */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Draw Hand</Text>
        <View style={styles.row}>
          {HANDEDNESS.map((h) => (
            <SelectOption
              key={h.value}
              label={h.label}
              selected={handedness === h.value}
              onPress={() => setHandedness(h.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      {/* Experience */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Experience Level</Text>
        <View style={styles.grid}>
          {EXPERIENCE.map((e) => (
            <SelectOption
              key={e.value}
              label={e.label}
              selected={experience === e.value}
              onPress={() => setExperience(e.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  fieldLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  halfOption: {
    flex: 1,
    minWidth: '45%',
  },
  actions: {
    marginTop: Spacing.md,
  },
});
