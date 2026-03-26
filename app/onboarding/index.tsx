import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Target, ChevronRight } from 'lucide-react-native';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Option selector ──────────────────────────────────────────────────────────

interface OptionItem {
  value: string;
  label: string;
}

function OptionRow({
  options,
  selected,
  onSelect,
}: {
  options: OptionItem[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={optStyles.row}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.7}
          style={[optStyles.option, selected === opt.value && optStyles.optionActive]}
        >
          <Text
            style={[optStyles.optionText, selected === opt.value && optStyles.optionTextActive]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const optStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  option: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPrimary,
  },
  optionActive: {
    backgroundColor: Colors.clayDark,
    borderColor: Colors.clayDark,
  },
  optionText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  optionTextActive: {
    color: Colors.bgPrimary,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const HANDEDNESS = [
  { value: 'rh', label: 'Right-Handed' },
  { value: 'lh', label: 'Left-Handed' },
];

const EXPERIENCE = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'competitive', label: 'Competitive' },
];

const DISCIPLINE = [
  { value: '3d', label: '3D' },
  { value: 'field', label: 'Field' },
  { value: 'target', label: 'Target' },
];

const RELEASE = [
  { value: 'wrist-strap', label: 'Wrist Strap' },
  { value: 'thumb', label: 'Thumb Button' },
  { value: 'hinge', label: 'Hinge / Back Tension' },
  { value: 'tension', label: 'Tension Device' },
  { value: 'finger', label: 'Finger Tab' },
];

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [hand, setHand] = useState('rh');
  const [exp, setExp] = useState('intermediate');
  const [discipline, setDiscipline] = useState('3d');
  const [release, setRelease] = useState('wrist-strap');

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Target size={32} color={Colors.bgPrimary} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>NOCKED</Text>
          <Text style={styles.heroSubtitle}>Precision bow tuning &amp; coaching</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>YOUR NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Sarah Mitchell"
              placeholderTextColor={Colors.greyLight}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          {/* Handedness */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DRAW HAND</Text>
            <OptionRow options={HANDEDNESS} selected={hand} onSelect={setHand} />
          </View>

          {/* Experience */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>EXPERIENCE LEVEL</Text>
            <OptionRow options={EXPERIENCE} selected={exp} onSelect={setExp} />
          </View>

          {/* Discipline */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>PRIMARY DISCIPLINE</Text>
            <OptionRow options={DISCIPLINE} selected={discipline} onSelect={setDiscipline} />
          </View>

          {/* Release */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>RELEASE TYPE</Text>
            <OptionRow options={RELEASE} selected={release} onSelect={setRelease} />
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          activeOpacity={0.85}
          disabled={!canContinue}
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>Set Up My Profile</Text>
          <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.skip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxxl,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  heroSubtitle: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },

  form: { gap: Spacing.xl },
  field: { gap: Spacing.sm },
  fieldLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  input: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  cta: {
    backgroundColor: Colors.clayDark,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },
  skip: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
});
