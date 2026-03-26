import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CheckCircle, Plus } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { GroupSize, ShotEnd } from '@/types';

const ARROW_COUNTS = [3, 5, 6];
const DISTANCES = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100];

const GROUP_OPTIONS: { value: GroupSize; label: string; desc: string }[] = [
  { value: 'tight', label: 'Tight', desc: 'All in a fist or smaller' },
  { value: 'medium', label: 'Medium', desc: 'Spread but consistent' },
  { value: 'scattered', label: 'Scattered', desc: 'Erratic, no pattern' },
];

const FORM_COMPONENTS = [
  'Stance', 'Grip', 'Draw & Back Tension', 'Anchor Point',
  'Peep & Sight Alignment', 'Release Technique', 'Follow Through', 'Breathing',
];

export default function SessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const shotSessions = useAppStore((s) => s.shotSessions);
  const updateShotSession = useAppStore((s) => s.updateShotSession);

  const session = shotSessions.find((s) => s.id === sessionId);

  // End entry state
  const [arrowCount, setArrowCount] = useState(3);
  const [distance, setDistance] = useState(20);
  const [groupSize, setGroupSize] = useState<GroupSize | null>(null);
  const [formIssues, setFormIssues] = useState<string[]>([]);
  const [endNotes, setEndNotes] = useState('');

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Session not found.</Text>
      </SafeAreaView>
    );
  }

  const toggleFormIssue = (tag: string) => {
    setFormIssues((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLogEnd = () => {
    const newEnd: ShotEnd = {
      endNumber: session.ends.length + 1,
      arrowCount,
      distance,
      groupSize: groupSize ?? undefined,
      formIssues,
      notes: endNotes.trim() || undefined,
    };
    const newEnds = [...session.ends, newEnd];
    const newTotal = newEnds.reduce((sum, e) => sum + e.arrowCount, 0);

    updateShotSession(session.id, {
      ends: newEnds,
      totalArrows: newTotal,
    });

    // Reset end state
    setGroupSize(null);
    setFormIssues([]);
    setEndNotes('');
  };

  const handleFinish = () => {
    if (session.ends.length === 0) {
      Alert.alert('No ends logged', 'Log at least one end before finishing.');
      return;
    }
    updateShotSession(session.id, { completed: true });
    router.replace({ pathname: '/shot-analyzer/session-summary', params: { sessionId: session.id } });
  };

  const handleAbandon = () => {
    Alert.alert('Abandon Session', 'This session will be discarded.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Abandon', style: 'destructive', onPress: () => router.replace('/shot-analyzer') },
    ]);
  };

  // Show focused form components at top if session has a form focus
  const focusedComponents = session.formFocus.length > 0
    ? session.formFocus
    : FORM_COMPONENTS;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleAbandon} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.headerTitle}>End {session.ends.length + 1}</Text>
          <Text style={styles.headerSub}>
            {session.totalArrows} arrows · {session.ends.length} ends
          </Text>
        </View>
        <TouchableOpacity onPress={handleFinish} hitSlop={12}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Arrow count */}
        <Text style={styles.sectionLabel}>Arrows This End</Text>
        <View style={styles.chipRow}>
          {ARROW_COUNTS.map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setArrowCount(n)}
              activeOpacity={0.7}
              style={[styles.chip, arrowCount === n && styles.chipActive]}
            >
              <Text style={[styles.chipText, arrowCount === n && styles.chipTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Distance */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Distance (yards)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.distanceScroll}
          contentContainerStyle={styles.distanceScrollContent}
        >
          {DISTANCES.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setDistance(d)}
              activeOpacity={0.7}
              style={[styles.distanceChip, distance === d && styles.chipActive]}
            >
              <Text style={[styles.chipText, distance === d && styles.chipTextActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Group size */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Group Size</Text>
        <View style={styles.groupRow}>
          {GROUP_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setGroupSize(groupSize === opt.value ? null : opt.value)}
              activeOpacity={0.7}
              style={[styles.groupCard, groupSize === opt.value && styles.groupCardActive]}
            >
              <Text style={[styles.groupLabel, groupSize === opt.value && styles.groupLabelActive]}>
                {opt.label}
              </Text>
              <Text style={styles.groupDesc}>{opt.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form issues */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Form Issues This End</Text>
        <View style={styles.formGrid}>
          {focusedComponents.map((component) => {
            const isTagged = formIssues.includes(component);
            return (
              <TouchableOpacity
                key={component}
                onPress={() => toggleFormIssue(component)}
                activeOpacity={0.7}
                style={[styles.formChip, isTagged && styles.formChipTagged]}
              >
                {isTagged && (
                  <CheckCircle size={12} color={Colors.statusError} strokeWidth={2} />
                )}
                <Text style={[styles.formChipText, isTagged && styles.formChipTextTagged]}>
                  {component}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* End notes */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>End Notes</Text>
        <TextInput
          value={endNotes}
          onChangeText={setEndNotes}
          placeholder="What happened this end?"
          placeholderTextColor={Colors.greyLight}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        {/* Log end button */}
        <TouchableOpacity onPress={handleLogEnd} activeOpacity={0.7} style={styles.logButton}>
          <Plus size={18} color={Colors.bgPrimary} strokeWidth={2} />
          <Text style={styles.logButtonText}>Log End {session.ends.length + 1}</Text>
        </TouchableOpacity>

        {/* Recent ends */}
        {session.ends.length > 0 && (
          <View style={styles.recentEnds}>
            <Text style={styles.sectionLabel}>Recent Ends</Text>
            {[...session.ends].reverse().slice(0, 4).map((end) => (
              <View key={end.endNumber} style={styles.endRow}>
                <Text style={styles.endNum}>E{end.endNumber}</Text>
                <Text style={styles.endDist}>{end.distance}yd</Text>
                <Text style={styles.endArrows}>{end.arrowCount} arrows</Text>
                {end.groupSize && (
                  <Text style={styles.endGroup}>{end.groupSize}</Text>
                )}
                {end.formIssues.length > 0 && (
                  <Text style={styles.endIssues}>{end.formIssues.length} issue{end.formIssues.length > 1 ? 's' : ''}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  errorText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: { padding: Spacing.xs },
  topCenter: { alignItems: 'center' },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  headerSub: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: 1,
  },
  finishText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayMid,
    padding: Spacing.xs,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.sm,
  },

  chipRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPrimary,
    minWidth: 56,
    alignItems: 'center',
  },
  chipActive: { borderColor: Colors.clayDark, backgroundColor: Colors.bgSecondary },
  chipText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  chipTextActive: { color: Colors.clayDark },

  distanceScroll: { flexGrow: 0, marginBottom: Spacing.xs },
  distanceScrollContent: { gap: Spacing.sm, paddingRight: Spacing.md },
  distanceChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPrimary,
    minWidth: 48,
    alignItems: 'center',
  },

  groupRow: { flexDirection: 'row', gap: Spacing.sm },
  groupCard: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  groupCardActive: { borderColor: Colors.clayMid },
  groupLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  groupLabelActive: { color: Colors.clayDark },
  groupDesc: {
    ...Typography.body,
    fontSize: 9,
    color: Colors.greyLight,
    textAlign: 'center',
    lineHeight: 14,
  },

  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  formChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  formChipTagged: {
    borderColor: Colors.statusError,
    backgroundColor: '#F5E6E0',
  },
  formChipText: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  formChipTextTagged: { color: Colors.statusError },

  notesInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgPrimary,
    fontFamily: 'Raleway_400Regular',
    fontSize: FontSizes.sm,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },

  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.clayDark,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  logButtonText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },

  recentEnds: { gap: Spacing.xs },
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  endNum: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyLight, width: 28 },
  endDist: { ...Typography.bodyMedium, fontSize: FontSizes.sm, color: Colors.textPrimary, width: 44 },
  endArrows: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid, flex: 1 },
  endGroup: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.textSecondary },
  endIssues: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.statusError },
});
