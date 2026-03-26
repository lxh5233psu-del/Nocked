import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Info } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { SelectOption } from '@/components/ui/SelectOption';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

type SetupAnswer = 'yes' | 'no' | 'not-sure';

const OPTIONS: { label: string; value: SetupAnswer }[] = [
  { label: 'Yes — it has been professionally set up', value: 'yes' },
  { label: 'No — starting from scratch', value: 'no' },
  { label: 'Not Sure', value: 'not-sure' },
];

export default function SetupCheckScreen() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [answer, setAnswer] = useState<SetupAnswer | null>(null);

  const handleContinue = () => {
    completeOnboarding();
    if (answer === 'yes') {
      router.replace('/(home)');
    } else {
      // 'no' or 'not-sure' → recommend setup phase
      router.replace('/(home)');
      // Setup module will be highlighted as recommended on home screen
    }
  };

  const showRecommendation = answer === 'no' || answer === 'not-sure';

  return (
    <OnboardingLayout
      step={7}
      totalSteps={8}
      title="Setup Check"
      subtitle="Has your bow been professionally set up before?"
    >
      <View style={styles.options}>
        {OPTIONS.map((o) => (
          <SelectOption
            key={o.value}
            label={o.label}
            selected={answer === o.value}
            onPress={() => setAnswer(o.value)}
          />
        ))}
      </View>

      {showRecommendation && (
        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Info size={16} color={Colors.clayMid} strokeWidth={1.5} />
            <Text style={styles.infoText}>
              We recommend starting with the Setup Phase. It walks you through every component
              installation and establishes the correct baseline for all tuning. Takes 1–2 hours
              with all tools present.
            </Text>
          </View>
        </Card>
      )}

      <View style={styles.actions}>
        <Button
          label={answer === 'yes' ? "Go to Home Screen" : "Start Setup Phase"}
          onPress={handleContinue}
          disabled={answer === null}
        />
        {answer === 'no' || answer === 'not-sure' ? (
          <Button
            label="Skip Setup — Go to Home"
            variant="ghost"
            onPress={() => {
              completeOnboarding();
              router.replace('/(home)');
            }}
          />
        ) : null}
      </View>

      <Text style={styles.footnote}>
        You can always access Setup from the home screen.
      </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.sm,
  },
  footnote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
