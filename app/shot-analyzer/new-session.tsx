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
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { WindCondition, LightCondition } from '@/types';
import { generateId } from '@/utils/id';

// Form module component names for the focus selector
const FORM_COMPONENTS = [
  'Stance',
  'Grip',
  'Draw & Back Tension',
  'Anchor Point',
  'Peep & Sight Alignment',
  'Release Technique',
  'Follow Through',
  'Breathing',
];

const WIND_OPTIONS: { value: WindCondition; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
];

const LIGHT_OPTIONS: { value: LightCondition; label: string }[] = [
  { value: 'bright', label: 'Bright Sun' },
  { value: 'overcast', label: 'Overcast' },
  { value: 'low-light', label: 'Low Light' },
  { value: 'indoor', label: 'Indoor' },
];

export default function NewSessionScreen() {
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const addShotSession = useAppStore((s) => s.addShotSession);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [location, setLocation] = useState('');
  const [goal, setGoal] = useState('');
  const [wind, setWind] = useState<WindCondition | null>(null);
  const [light, setLight] = useState<LightCondition | null>(null);
  const [formFocus, setFormFocus] = useState<string[]>([]);

  const activeBow = bowProfiles.find((b) => b.id === activeBowId);

  const toggleFormFocus = (component: string) => {
    setFormFocus((prev) =>
      prev.includes(component)
        ? prev.filter((c) => c !== component)
        : [...prev, component]
    );
  };

  const handleStart = () => {
    const id = generateId();
    addShotSession({
      id,
      date: Date.now(),
      bowId: activeBowId ?? undefined,
      location: location.trim() || undefined,
      goal: goal.trim() || undefined,
      wind: wind ?? undefined,
      light: light ?? undefined,
      ends: [],
      totalArrows: 0,
      formFocus,
      completed: false,
    });
    setLastSession({ module: 'Shot Analyzer', step: 'Session', timestamp: Date.now() });
    router.replace({ pathname: '/shot-analyzer/session', params: { sessionId: id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Session</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bow context */}
        {activeBow && (
          <View style={styles.bowContext}>
            <Text style={styles.bowContextLabel}>Bow</Text>
            <Text style={styles.bowContextValue}>{activeBow.nickname}</Text>
          </View>
        )}

        {/* Details */}
        <Text style={styles.sectionLabel}>Session Details</Text>
        <View style={styles.inputGroup}>
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Backyard, Pine Creek Range"
            optional
          />
          <TextInput
            label="Session Goal"
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Work on release, 60-arrow practice"
            optional
          />
        </View>

        {/* Conditions */}
        <Text style={styles.sectionLabel}>Conditions</Text>
        <Text style={styles.conditionSubLabel}>Wind</Text>
        <View style={styles.chipRow}>
          {WIND_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setWind(wind === opt.value ? null : opt.value)}
              activeOpacity={0.7}
              style={[styles.chip, wind === opt.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, wind === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.conditionSubLabel, { marginTop: Spacing.md }]}>Light</Text>
        <View style={styles.chipRow}>
          {LIGHT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setLight(light === opt.value ? null : opt.value)}
              activeOpacity={0.7}
              style={[styles.chip, light === opt.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, light === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form focus */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
          Form Focus <Text style={styles.optionalNote}>(optional — select components to watch)</Text>
        </Text>
        <View style={styles.formFocusGrid}>
          {FORM_COMPONENTS.map((component) => {
            const isSelected = formFocus.includes(component);
            return (
              <TouchableOpacity
                key={component}
                onPress={() => toggleFormFocus(component)}
                activeOpacity={0.7}
                style={[styles.formChip, isSelected && styles.formChipActive]}
              >
                <Text style={[styles.formChipText, isSelected && styles.formChipTextActive]}>
                  {component}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button label="Start Session" onPress={handleStart} />
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
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },

  bowContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
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

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  optionalNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    fontStyle: 'italic',
  },
  inputGroup: { gap: Spacing.md, marginBottom: Spacing.xl },

  conditionSubLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPrimary,
  },
  chipActive: {
    borderColor: Colors.clayDark,
    backgroundColor: Colors.bgSecondary,
  },
  chipText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  chipTextActive: { color: Colors.clayDark },

  formFocusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  formChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPrimary,
  },
  formChipActive: {
    borderColor: Colors.clayMid,
    backgroundColor: Colors.bgSecondary,
  },
  formChipText: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  formChipTextActive: { color: Colors.textPrimary },

  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
});
