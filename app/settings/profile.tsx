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
import { SelectOption } from '@/components/ui/SelectOption';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import {
  Handedness,
  ExperienceLevel,
  Discipline,
  ReleaseType,
} from '@/types';

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Pro/Coach'];
const DISCIPLINES: Discipline[] = ['Target/3D', 'Bowhunting', 'Both'];
const RELEASE_TYPES: ReleaseType[] = ['Wrist strap', 'Thumb button', 'Hinge', 'Back tension', 'Other'];

export default function ProfileSettingsScreen() {
  const archerProfile = useAppStore((s) => s.archerProfile);
  const discipline = useAppStore((s) => s.discipline);
  const releaseProfile = useAppStore((s) => s.releaseProfile);
  const setArcherProfile = useAppStore((s) => s.setArcherProfile);
  const setDiscipline = useAppStore((s) => s.setDiscipline);
  const setReleaseProfile = useAppStore((s) => s.setReleaseProfile);

  const [name, setName] = useState(archerProfile?.name ?? '');
  const [handedness, setHandedness] = useState<Handedness>(
    archerProfile?.handedness ?? 'RH'
  );
  const [experience, setExperience] = useState<ExperienceLevel>(
    archerProfile?.experience ?? 'Beginner'
  );
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(
    discipline
  );
  const [releaseType, setReleaseType] = useState<ReleaseType | null>(
    releaseProfile?.type ?? null
  );
  const [releaseBrand, setReleaseBrand] = useState(releaseProfile?.brand ?? '');
  const [releaseModel, setReleaseModel] = useState(releaseProfile?.model ?? '');

  const canSave = name.trim().length > 0 && selectedDiscipline !== null;

  const handleSave = () => {
    setArcherProfile({ name: name.trim(), handedness, experience });
    if (selectedDiscipline) setDiscipline(selectedDiscipline);
    if (releaseType) {
      setReleaseProfile({
        type: releaseType,
        brand: releaseBrand.trim() || undefined,
        model: releaseModel.trim() || undefined,
      });
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Archer Profile</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Identity */}
        <Text style={styles.sectionLabel}>Identity</Text>
        <View style={styles.group}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            returnKeyType="done"
          />

          <View style={styles.fieldGap}>
            <Text style={styles.fieldLabel}>Handedness</Text>
            <View style={styles.twoCol}>
              {(['RH', 'LH'] as Handedness[]).map((h) => (
                <SelectOption
                  key={h}
                  label={h === 'RH' ? 'Right-Handed' : 'Left-Handed'}
                  selected={handedness === h}
                  onPress={() => setHandedness(h)}
                  style={styles.halfOption}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGap}>
            <Text style={styles.fieldLabel}>Experience Level</Text>
            <View style={styles.twoCol}>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <SelectOption
                  key={lvl}
                  label={lvl}
                  selected={experience === lvl}
                  onPress={() => setExperience(lvl)}
                  style={styles.halfOption}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Discipline */}
        <Text style={styles.sectionLabel}>Discipline</Text>
        <View style={styles.group}>
          <View style={styles.colOptions}>
            {DISCIPLINES.map((d) => (
              <SelectOption
                key={d}
                label={d}
                selected={selectedDiscipline === d}
                onPress={() => setSelectedDiscipline(d)}
              />
            ))}
          </View>
        </View>

        {/* Release */}
        <Text style={styles.sectionLabel}>Release</Text>
        <View style={styles.group}>
          <View style={styles.twoColWrap}>
            {RELEASE_TYPES.map((rt) => (
              <SelectOption
                key={rt}
                label={rt}
                selected={releaseType === rt}
                onPress={() => setReleaseType(releaseType === rt ? null : rt)}
                style={styles.halfOption}
              />
            ))}
          </View>

          {releaseType && (
            <View style={styles.fieldGap}>
              <View style={styles.twoCol}>
                <TextInput
                  label="Brand"
                  value={releaseBrand}
                  onChangeText={setReleaseBrand}
                  placeholder="e.g. Tru-Fire"
                  optional
                  style={styles.halfField}
                />
                <TextInput
                  label="Model"
                  value={releaseModel}
                  onChangeText={setReleaseModel}
                  placeholder="e.g. Hardcore"
                  optional
                  style={styles.halfField}
                />
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button label="Save Changes" onPress={handleSave} disabled={!canSave} />
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

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  group: { gap: Spacing.md },
  fieldGap: { gap: Spacing.sm },
  fieldLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  twoCol: { flexDirection: 'row', gap: Spacing.sm },
  twoColWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  halfOption: { flex: 1 },
  halfField: { flex: 1 },
  colOptions: { gap: Spacing.sm },

  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
});
