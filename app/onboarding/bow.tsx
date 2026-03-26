import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { TextInput } from '@/components/ui/TextInput';
import { Picker } from '@/components/ui/Picker';
import { SelectOption } from '@/components/ui/SelectOption';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { BowProfile, RestType, SightType } from '@/types';
import {
  MANUFACTURERS,
  getModelsByManufacturer,
} from '@/database/bow-data';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';
import { generateId } from '@/utils/id';

const REST_TYPES: { label: string; value: RestType }[] = [
  { label: 'Drop-Away (Cable)', value: 'Drop-away (cable)' },
  { label: 'Drop-Away (Limb)', value: 'Drop-away (limb)' },
  { label: 'Full Capture', value: 'Full capture' },
  { label: 'Shoot-Through', value: 'Shoot-through' },
];

const SIGHT_TYPES: { label: string; value: SightType }[] = [
  { label: 'Single Pin', value: 'Single pin' },
  { label: 'Multi Pin', value: 'Multi pin' },
];

const MANUFACTURER_OPTIONS = MANUFACTURERS.map((m) => ({ label: m, value: m }));

export default function BowScreen() {
  const addBowProfile = useAppStore((s) => s.addBowProfile);

  const [nickname, setNickname] = useState('');
  const [manufacturer, setManufacturer] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [drawWeight, setDrawWeight] = useState('');
  const [drawLength, setDrawLength] = useState('');
  const [restType, setRestType] = useState<RestType | null>(null);
  const [restManufacturer, setRestManufacturer] = useState('');
  const [restModel, setRestModel] = useState('');
  const [sightType, setSightType] = useState<SightType | null>(null);
  const [sightManufacturer, setSightManufacturer] = useState('');
  const [sightModel, setSightModel] = useState('');

  // Reset model when manufacturer changes
  useEffect(() => {
    setModel(null);
  }, [manufacturer]);

  const modelOptions =
    manufacturer && manufacturer !== 'Other'
      ? [
          ...getModelsByManufacturer(manufacturer).map((b) => ({
            label: `${b.model} (${b.year})`,
            value: b.id,
          })),
          { label: 'Other / Not Listed', value: 'other' },
        ]
      : [{ label: 'Other / Not Listed', value: 'other' }];

  const canContinue =
    manufacturer !== null &&
    model !== null &&
    drawWeight !== '' &&
    drawLength !== '' &&
    restType !== null &&
    sightType !== null;

  const handleContinue = () => {
    if (!manufacturer || !model || !restType || !sightType) return;

    const bow: BowProfile = {
      id: generateId(),
      nickname: nickname || `${manufacturer} ${model.replace(/-\d{4}$/, '')}`,
      manufacturer,
      model,
      drawWeight: parseFloat(drawWeight),
      drawLength: parseFloat(drawLength),
      restType,
      restManufacturer: restManufacturer || undefined,
      restModel: restModel || undefined,
      sightType,
      sightManufacturer: sightManufacturer || undefined,
      sightModel: sightModel || undefined,
      setupComplete: false,
      setupStepsComplete: [],
      setupData: {},
      tuningModulesComplete: [],
    };

    addBowProfile(bow);
    router.push('/onboarding/arrow');
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={8}
      title="Bow Profile"
      subtitle="Your bow's data powers tuning instructions, module settings, and database lookups throughout the app."
    >
      {/* Nickname */}
      <TextInput
        label="Bow Nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholder='e.g. "Hunting Rig" or "Target Setup"'
        optional
        style={styles.field}
      />

      {/* Manufacturer */}
      <Picker
        label="Manufacturer"
        value={manufacturer}
        options={MANUFACTURER_OPTIONS}
        onValueChange={setManufacturer}
        style={styles.field}
      />

      {/* Model */}
      <Picker
        label="Model"
        value={model}
        options={modelOptions}
        onValueChange={setModel}
        placeholder={manufacturer ? 'Select model…' : 'Select manufacturer first'}
        style={styles.field}
      />

      {/* Draw weight & length */}
      <View style={styles.row}>
        <TextInput
          label="Draw Weight (lbs)"
          value={drawWeight}
          onChangeText={setDrawWeight}
          placeholder="e.g. 65"
          keyboardType="decimal-pad"
          style={styles.halfField}
        />
        <TextInput
          label="Draw Length (in)"
          value={drawLength}
          onChangeText={setDrawLength}
          placeholder="e.g. 28.5"
          keyboardType="decimal-pad"
          style={styles.halfField}
        />
      </View>

      {/* Rest type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Rest Type</Text>
        <View style={styles.grid}>
          {REST_TYPES.map((r) => (
            <SelectOption
              key={r.value}
              label={r.label}
              selected={restType === r.value}
              onPress={() => setRestType(r.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      {/* Rest brand/model */}
      <View style={styles.row}>
        <TextInput
          label="Rest Brand"
          value={restManufacturer}
          onChangeText={setRestManufacturer}
          placeholder="e.g. Hamskea"
          optional
          style={styles.halfField}
        />
        <TextInput
          label="Rest Model"
          value={restModel}
          onChangeText={setRestModel}
          placeholder="e.g. Epsilon"
          optional
          style={styles.halfField}
        />
      </View>

      {/* Sight type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Sight Type</Text>
        <View style={styles.row}>
          {SIGHT_TYPES.map((s) => (
            <SelectOption
              key={s.value}
              label={s.label}
              selected={sightType === s.value}
              onPress={() => setSightType(s.value)}
              style={styles.halfOption}
            />
          ))}
        </View>
      </View>

      {/* Sight brand/model */}
      <View style={styles.row}>
        <TextInput
          label="Sight Brand"
          value={sightManufacturer}
          onChangeText={setSightManufacturer}
          placeholder="e.g. Spot Hogg"
          optional
          style={styles.halfField}
        />
        <TextInput
          label="Sight Model"
          value={sightModel}
          onChangeText={setSightModel}
          placeholder="e.g. Fast Eddie"
          optional
          style={styles.halfField}
        />
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
          onPress={() => router.push('/onboarding/arrow')}
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
