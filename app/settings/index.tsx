import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  User,
  Crosshair,
  SlidersHorizontal,
  Wrench,
  Bell,
  Ruler,
  Info,
  Trash2,
  ChevronRight,
  CheckCircle,
} from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PROFILE = {
  name: 'Sarah Mitchell',
  handedness: 'Right-Handed',
  experience: 'Advanced',
  discipline: '3D',
  releaseType: 'Wrist Strap',
};

const BOWS = [
  { id: '1', nickname: '2024 Hoyt Carbon RX-9', drawWeight: 68, active: true },
  { id: '2', nickname: '2022 Mathews V3X', drawWeight: 65, active: false },
];

const APP_VERSION = '1.0.0 (SDK 54)';

// ─── Row components ───────────────────────────────────────────────────────────

interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  right?: React.ReactNode;
}

function SettingsRow({ icon, label, value, onPress, destructive, right }: SettingsRowProps) {
  const Inner = (
    <View style={rowStyles.row}>
      {icon && <View style={rowStyles.iconWrap}>{icon}</View>}
      <Text
        style={[
          rowStyles.label,
          icon ? rowStyles.labelWithIcon : undefined,
          destructive && rowStyles.labelDestructive,
        ]}
      >
        {label}
      </Text>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        {right ?? (onPress && !right && (
          <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
        ))}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Inner}
      </TouchableOpacity>
    );
  }
  return Inner;
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    minHeight: 48,
  },
  iconWrap: { width: 28, alignItems: 'center' },
  label: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  labelWithIcon: { marginLeft: Spacing.sm },
  labelDestructive: { color: '#8A4A4A' },
  right: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  value: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
});

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <Text style={sectionStyles.title}>{title}</Text>;
}

const sectionStyles = StyleSheet.create({
  title: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const [unitsMetric, setUnitsMetric] = useState(false);
  const [formReminders, setFormReminders] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Settings" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Archer ── */}
        <SectionHeader title="ARCHER" />
        <Card style={styles.section}>
          {/* Profile summary */}
          <View style={styles.profileSummary}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {PROFILE.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{PROFILE.name}</Text>
              <Text style={styles.profileMeta}>
                {PROFILE.experience} · {PROFILE.discipline} · {PROFILE.releaseType}
              </Text>
            </View>
            <TouchableOpacity hitSlop={8}>
              <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <SettingsRow
            icon={<User size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Edit Profile"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<SlidersHorizontal size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Discipline"
            value={PROFILE.discipline}
            onPress={() => {}}
          />
        </Card>

        {/* ── Equipment ── */}
        <SectionHeader title="EQUIPMENT" />
        <Card style={styles.section}>
          <Text style={styles.equipLabel}>BOW PROFILES</Text>
          {BOWS.map((bow) => (
            <View key={bow.id} style={styles.bowRow}>
              {bow.active ? (
                <CheckCircle size={16} color={Colors.statusComplete} strokeWidth={1.5} />
              ) : (
                <View style={styles.inactiveDot} />
              )}
              <View style={styles.bowInfo}>
                <Text style={styles.bowNickname}>{bow.nickname}</Text>
                <Text style={styles.bowDetail}>{bow.drawWeight} lbs</Text>
              </View>
              <TouchableOpacity hitSlop={8}>
                <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addBowBtn} activeOpacity={0.7}>
            <Text style={styles.addBowText}>+ Add Bow Profile</Text>
          </TouchableOpacity>

          <SettingsRow
            icon={<Crosshair size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Release Type"
            value={PROFILE.releaseType}
            onPress={() => {}}
          />
        </Card>

        {/* ── Tools ── */}
        <SectionHeader title="TOOLS" />
        <Card style={styles.section}>
          <SettingsRow
            icon={<Wrench size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Tool Inventory"
            value="14 of 19 available"
            onPress={() => {}}
          />
        </Card>

        {/* ── Preferences ── */}
        <SectionHeader title="PREFERENCES" />
        <Card style={styles.section}>
          <SettingsRow
            icon={<Ruler size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Units"
            value={unitsMetric ? 'Metric' : 'Imperial'}
            right={
              <Switch
                value={unitsMetric}
                onValueChange={setUnitsMetric}
                trackColor={{ false: Colors.border, true: Colors.clayMid }}
                thumbColor={Colors.bgPrimary}
                ios_backgroundColor={Colors.border}
              />
            }
          />
          <SettingsRow
            icon={<Bell size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Form Reminders"
            right={
              <Switch
                value={formReminders}
                onValueChange={setFormReminders}
                trackColor={{ false: Colors.border, true: Colors.clayMid }}
                thumbColor={Colors.bgPrimary}
                ios_backgroundColor={Colors.border}
              />
            }
          />
        </Card>

        {/* ── About ── */}
        <SectionHeader title="ABOUT" />
        <Card style={styles.section}>
          <SettingsRow
            icon={<Info size={16} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Version"
            value={APP_VERSION}
          />
          <SettingsRow label="Privacy Policy" onPress={() => {}} />
          <SettingsRow label="Terms of Use" onPress={() => {}} />
        </Card>

        {/* ── Data ── */}
        <SectionHeader title="DATA" />
        <Card style={styles.section}>
          <SettingsRow
            icon={<Trash2 size={16} color="#8A4A4A" strokeWidth={1.5} />}
            label="Reset All Data"
            destructive
            onPress={() => {}}
          />
        </Card>

        <Text style={styles.footer}>
          NOCKED · Precision Bow Tuning &amp; Coaching
        </Text>
      </ScrollView>
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

  section: { gap: 0, padding: 0, paddingHorizontal: Spacing.md, overflow: 'hidden' },

  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.bgPrimary,
  },
  profileInfo: { flex: 1 },
  profileName: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  profileMeta: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },

  equipLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs - 1,
    color: Colors.greyLight,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  bowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  inactiveDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  bowInfo: { flex: 1 },
  bowNickname: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  bowDetail: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  addBowBtn: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  addBowText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },

  footer: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
