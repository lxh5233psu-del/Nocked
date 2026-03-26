import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { TextInput } from '@/components/ui/TextInput';
import { SelectOption } from '@/components/ui/SelectOption';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { ArrowProfile, NockType, FletchingType, VaneConfiguration } from '@/types';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';
import { generateId } from '@/utils/id';

const NOCK_TYPES: { label: string; value: NockType }[] = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Lighted', value: 'Lighted' },
  { label: 'Half-Moon', value: 'Half-moon' },
  { label: 'Capture', value: 'Capture' },
];

const FLETCHING_TYPES: { label: string; value: FletchingType }[] = [
  { label: 'Plastic Vane', value: 'Plastic vane' },
  { label: 'Feather', value: 'Feather' },
  { label: 'Hybrid', value: 'Hybrid' },
];

const VANE_CONFIGS: { label: string; value: VaneConfiguration }[] = [
  { label: '3 Fletch', value: '3 fletch' },
  { label: '4 Fletch', value: '4 fletch' },
  { label: 'Helical', value: 'Helical' },
  { label: 'Straight', value: 'Straight' },
];

export default function ArrowScreen() {
  const addArrowProfile = useAppStore((s) => s.addArrowProfile);

  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [length, setLength] = useState('');
  const [spine, setSpine] = useState('');
  const [pointWeight, setPointWeight] = useState('');
  const [nockType, setNockType] = useState<NockType | null>(null);
  const [fletchingType, setFletchingType] = useState<FletchingType | null>(null);
  const [vaneConfig, setVaneConfig] = useState<VaneConfiguration | null>(null);

  const canContinue =
    manufacturer !== '' &&
    model !== '' &&
    length !== '' &&
    spine !== '' &&
    pointWeight !== '' &&
    nockType !== null &&
    fletchingType !== null &&
    vaneConfig !== null;

  const handleContinue = () => {
    if (!nockType || !fletchingType || !vaneConfig) return;

    const arrow: ArrowProfile = {
      id: generateId(),
      manufacturer,
      model,
      length: parseFloat(length),
      spine: parseInt(spine, 10),
      pointWeight: parseInt(pointWeight, 10),
      nockType,
      fletchingType,
      vaneConfiguration: vaneConfig,
    };

    addArrowProfile(arrow);
    router.push('/onboarding/release');
  };

  return (
    <OnboardingLayout
      step={5}
      totalSteps={8}
      title="Arrow Profile"
      subtitle="Arrow specs are used in tuning calculations and spine recommendations."
    >
      {/* Brand / Model */}
      <View style={styles.row}>
        <TextInput
          label="Brand"
          value={manufacturer}
          onChangeText={setManufacturer}
          placeholder="e.g. Easton"
          style={styles.halfField}
        />
        <TextInput
          label="Model"
          value={model}
          onChangeText={setModel}
          placeholder="e.g. FMJ 5mm"
          style={styles.halfField}
        />
      </View>

      {/* Length / Spine / Point weight */}
      <View style={styles.row}>
        <TextInput
          label="Length (in)"
          value={length}
          onChangeText={setLength}
          placeholder="28.5"
          keyboardType="decimal-pad"
          style={styles.thirdField}
        />
        <TextInput
          label="Spine"
          value={spine}
          onChangeText={setSpine}
          placeholder="340"
          keyboardType="number-pad"
          style={styles.thirdField}
        />
        <TextInput
          label="Point Wt (gr)"
          value={pointWeight}
          onChangeText={setPointWeight}
          placeholder="100"
          keyboardType="number-pad"
          style={styles.thirdField}
        />
      </View>

      {/* Nock type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Nock Type</Text>
        <View style={styles.grid}>
          {NOCK_TYPES.map((n) => (
            <SelectOption
              key={n.value}
              label={n.label}
              selected={nockType === n.value}
              onPress={() => setNockType(n.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      {/* Fletching type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Fletching Type</Text>
        <View style={styles.grid}>
          {FLETCHING_TYPES.map((f) => (
            <SelectOption
              key={f.value}
              label={f.label}
              selected={fletchingType === f.value}
              onPress={() => setFletchingType(f.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      {/* Vane configuration */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Vane Configuration</Text>
        <View style={styles.grid}>
          {VANE_CONFIGS.map((v) => (
            <SelectOption
              key={v.value}
              label={v.label}
              selected={vaneConfig === v.value}
              onPress={() => setVaneConfig(v.value)}
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
        <Button
          label="Skip for Now"
          variant="ghost"
          onPress={() => router.push('/onboarding/release')}
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
    marginBottom: Spacing.lg,
  },
  halfField: {
    flex: 1,
  },
  thirdField: {
    flex: 1,
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
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
