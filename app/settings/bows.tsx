import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronLeft,
  Check,
  Trash2,
  Plus,
  CheckCircle,
  Circle,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { SelectOption } from '@/components/ui/SelectOption';
import { Picker } from '@/components/ui/Picker';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { BowProfile, RestType, SightType } from '@/types';
import { MANUFACTURERS, getModelsByManufacturer } from '@/database/bow-data';
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

export default function BowsSettingsScreen() {
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const setActiveBow = useAppStore((s) => s.setActiveBow);
  const deleteBowProfile = useAppStore((s) => s.deleteBowProfile);
  const addBowProfile = useAppStore((s) => s.addBowProfile);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (bow: BowProfile) => {
    Alert.alert(
      `Delete "${bow.nickname}"?`,
      'This will permanently remove this bow and all its setup data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteBowProfile(bow.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bow Profiles</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
          hitSlop={12}
        >
          <Plus size={20} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bowProfiles.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No bows yet</Text>
            <Text style={styles.emptyText}>Tap + to add your first bow profile.</Text>
          </View>
        )}

        {bowProfiles.map((bow) => {
          const isActive = bow.id === activeBowId;
          return (
            <View key={bow.id} style={[styles.bowCard, isActive && styles.bowCardActive]}>
              <TouchableOpacity
                onPress={() => setActiveBow(bow.id)}
                activeOpacity={0.7}
                style={styles.bowCardMain}
              >
                <View style={styles.bowCardLeading}>
                  {isActive ? (
                    <CheckCircle size={20} color={Colors.clayDark} strokeWidth={1.5} />
                  ) : (
                    <Circle size={20} color={Colors.border} strokeWidth={1.5} />
                  )}
                </View>
                <View style={styles.bowCardContent}>
                  <Text style={styles.bowNickname}>{bow.nickname}</Text>
                  <Text style={styles.bowMeta}>
                    {bow.manufacturer} · {bow.drawWeight} lbs · {bow.drawLength}"
                  </Text>
                  <View style={styles.bowTags}>
                    {bow.setupComplete && (
                      <View style={styles.bowTag}>
                        <Text style={styles.bowTagText}>Setup Complete</Text>
                      </View>
                    )}
                    {bow.tuningModulesComplete.length > 0 && (
                      <View style={styles.bowTag}>
                        <Text style={styles.bowTagText}>
                          {bow.tuningModulesComplete.length} Tuning Methods
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(bow)}
                hitSlop={12}
                style={styles.deleteButton}
              >
                <Trash2 size={16} color={Colors.greyLight} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.7}
          style={styles.addCard}
        >
          <Plus size={18} color={Colors.clayMid} strokeWidth={1.5} />
          <Text style={styles.addCardText}>Add New Bow</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddBowModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(bow) => {
          addBowProfile(bow);
          setShowAddModal(false);
        }}
      />
    </SafeAreaView>
  );
}

// ─── Add Bow Modal ─────────────────────────────────────────────────────────────

function AddBowModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (bow: BowProfile) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [manufacturer, setManufacturer] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [drawWeight, setDrawWeight] = useState('');
  const [drawLength, setDrawLength] = useState('');
  const [restType, setRestType] = useState<RestType | null>(null);
  const [sightType, setSightType] = useState<SightType | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      setNickname('');
      setManufacturer(null);
      setModel(null);
      setDrawWeight('');
      setDrawLength('');
      setRestType(null);
      setSightType(null);
    }
  }, [visible]);

  useEffect(() => { setModel(null); }, [manufacturer]);

  const modelOptions = manufacturer && manufacturer !== 'Other'
    ? [
        ...getModelsByManufacturer(manufacturer).map((b) => ({
          label: `${b.model} (${b.year})`,
          value: b.id,
        })),
        { label: 'Other / Not Listed', value: 'other' },
      ]
    : [{ label: 'Other / Not Listed', value: 'other' }];

  const canAdd =
    manufacturer !== null &&
    model !== null &&
    drawWeight !== '' &&
    drawLength !== '' &&
    restType !== null &&
    sightType !== null;

  const handleAdd = () => {
    if (!manufacturer || !model || !restType || !sightType) return;
    const bow: BowProfile = {
      id: generateId(),
      nickname: nickname.trim() || `${manufacturer} ${model.replace(/-\d{4}$/, '')}`,
      manufacturer,
      model,
      drawWeight: parseFloat(drawWeight),
      drawLength: parseFloat(drawLength),
      restType,
      sightType,
      setupComplete: false,
      setupStepsComplete: [],
      setupData: {},
      tuningModulesComplete: [],
    };
    onAdd(bow);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <SafeAreaView style={modalStyles.sheet} edges={['bottom']}>
          <View style={modalStyles.handle} />
          <Text style={modalStyles.title}>Add Bow</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={modalStyles.scrollContent}
          >
            <TextInput
              label="Nickname"
              value={nickname}
              onChangeText={setNickname}
              placeholder='e.g. "Hunting Rig"'
              optional
              style={modalStyles.field}
            />

            <Picker
              label="Manufacturer"
              value={manufacturer}
              options={MANUFACTURER_OPTIONS}
              onValueChange={setManufacturer}
              style={modalStyles.field}
            />

            <Picker
              label="Model"
              value={model}
              options={modelOptions}
              onValueChange={setModel}
              placeholder={manufacturer ? 'Select model…' : 'Select manufacturer first'}
              style={modalStyles.field}
            />

            <View style={modalStyles.row}>
              <TextInput
                label="Draw Weight (lbs)"
                value={drawWeight}
                onChangeText={setDrawWeight}
                placeholder="65"
                keyboardType="decimal-pad"
                style={modalStyles.half}
              />
              <TextInput
                label="Draw Length (in)"
                value={drawLength}
                onChangeText={setDrawLength}
                placeholder="28.5"
                keyboardType="decimal-pad"
                style={modalStyles.half}
              />
            </View>

            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>Rest Type</Text>
              <View style={modalStyles.grid}>
                {REST_TYPES.map((r) => (
                  <SelectOption
                    key={r.value}
                    label={r.label}
                    selected={restType === r.value}
                    onPress={() => setRestType(r.value)}
                    style={modalStyles.halfOption}
                  />
                ))}
              </View>
            </View>

            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>Sight Type</Text>
              <View style={modalStyles.row}>
                {SIGHT_TYPES.map((s) => (
                  <SelectOption
                    key={s.value}
                    label={s.label}
                    selected={sightType === s.value}
                    onPress={() => setSightType(s.value)}
                    style={modalStyles.half}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={modalStyles.actions}>
            <Button label="Add Bow" onPress={handleAdd} disabled={!canAdd} />
            <Button label="Cancel" variant="ghost" onPress={onClose} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
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
  addButton: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  empty: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyLight,
  },

  bowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  bowCardActive: {
    borderColor: Colors.clayMid,
  },
  bowCardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  bowCardLeading: { width: 24, alignItems: 'center' },
  bowCardContent: { flex: 1, gap: 3 },
  bowNickname: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bowMeta: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  bowTags: { flexDirection: 'row', gap: Spacing.xs, marginTop: 2 },
  bowTag: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  bowTagText: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.clayMid,
  },
  deleteButton: {
    padding: Spacing.md,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  addCardText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayMid,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 39, 32, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  scrollContent: { paddingBottom: Spacing.md },
  field: { marginBottom: Spacing.lg, gap: Spacing.sm },
  fieldLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  half: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  halfOption: { flex: 1, minWidth: '45%' },
  actions: { gap: Spacing.sm, paddingTop: Spacing.md },
});
