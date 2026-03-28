import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAppStore } from '@/store/useAppStore';
import { SCORING_FORMATS } from '@/data/scoring-formats';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ScoringFormat } from '@/types';
import { generateId } from '@/utils/id';

export default function NewRoundScreen() {
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const addScoringRound = useAppStore((s) => s.addScoringRound);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [selectedFormat, setSelectedFormat] = useState<ScoringFormat | null>(null);
  const [location, setLocation] = useState('');

  const formatConfig = SCORING_FORMATS.find((f) => f.format === selectedFormat);
  const activeBow = bowProfiles.find((b) => b.id === activeBowId);

  const canStart = selectedFormat !== null;

  const handleStart = () => {
    if (!selectedFormat || !formatConfig) return;

    const id = generateId();
    addScoringRound({
      id,
      format: selectedFormat,
      date: Date.now(),
      bowId: activeBowId ?? undefined,
      location: location.trim() || undefined,
      totalTargets: formatConfig.defaultTargets,
      shots: [],
      totalScore: 0,
      avgPerTarget: 0,
      missCount: 0,
      xCount: 0,
      completed: false,
    });
    setLastSession({ module: 'Score', step: `${selectedFormat} Round`, timestamp: Date.now() });
    router.replace({ pathname: '/scoring/scorecard', params: { roundId: id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Round</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Select Format</Text>

        {SCORING_FORMATS.map((fmt) => {
          const isSelected = selectedFormat === fmt.format;
          return (
            <TouchableOpacity
              key={fmt.format}
              onPress={() => setSelectedFormat(fmt.format)}
              activeOpacity={0.7}
              style={[styles.formatCard, isSelected && styles.formatCardSelected]}
            >
              <View style={styles.formatCardRow}>
                <View style={styles.formatBadge}>
                  <Text style={styles.formatBadgeText}>{fmt.label}</Text>
                </View>
                <View style={styles.formatCardContent}>
                  <Text style={[styles.formatTitle, isSelected && styles.formatTitleSelected]}>
                    {fmt.description}
                  </Text>
                  <Text style={styles.formatMeta}>
                    {fmt.defaultTargets} targets · max {fmt.maxScorePerTarget} per target
                  </Text>
                </View>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>

              {/* Zone preview */}
              {isSelected && (
                <View style={styles.zoneRow}>
                  {fmt.zones.map((z) => (
                    <View key={z.label} style={styles.zoneChip}>
                      <Text style={styles.zoneChipText}>{z.label}</Text>
                      {z.value > 0 && <Text style={styles.zoneChipValue}>{z.value}pts</Text>}
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.optionalSection}>
          <Text style={styles.sectionLabel}>Round Details</Text>

          {activeBow && (
            <View style={styles.bowContext}>
              <Text style={styles.bowContextLabel}>Bow</Text>
              <Text style={styles.bowContextValue}>{activeBow.nickname}</Text>
            </View>
          )}

          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Pine Creek 3D Course"
            optional
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          label="Start Round"
          onPress={handleStart}
          disabled={!canStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  formatCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  formatCardSelected: {
    borderColor: Colors.clayDark,
  },
  formatCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  formatBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatBadgeText: {
    ...Typography.displayBold,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
    letterSpacing: 0,
  },
  formatCardContent: { flex: 1 },
  formatTitle: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  formatTitleSelected: {
    color: Colors.textPrimary,
  },
  formatMeta: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.clayDark,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.clayDark,
  },
  zoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  zoneChip: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    alignItems: 'center',
  },
  zoneChipText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  zoneChipValue: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyMid,
    marginTop: 1,
  },

  optionalSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  bowContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  bowContextLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  bowContextValue: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
});
