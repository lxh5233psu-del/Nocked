import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Settings,
  Target,
  Crosshair,
  SlidersHorizontal,
  Award,
  Video,
  ChevronRight,
  CheckCircle,
  Circle,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ARCHER = { name: 'Sarah Mitchell' };

const ACTIVE_BOW = {
  nickname: '2024 Hoyt Carbon RX-9',
  manufacturer: 'Hoyt',
  drawWeight: 68,
  drawLength: 28.5,
};

const BOW_LIST = [
  { id: '1', nickname: '2024 Hoyt Carbon RX-9', manufacturer: 'Hoyt', drawWeight: 68, drawLength: 28.5, active: true },
  { id: '2', nickname: '2022 Mathews V3X', manufacturer: 'Mathews', drawWeight: 65, drawLength: 27.5, active: false },
];

const LAST_SESSION = {
  module: 'Form',
  step: 'Release Technique',
  route: '/form',
};

const TUNING_STATUS = [
  { key: 'setup', label: 'Setup', complete: true },
  { key: 'sight-in', label: 'Sight-In', complete: true },
  { key: 'paper', label: 'Paper Tuning', complete: false },
  { key: 'walk-back', label: 'Walk-Back', complete: false },
  { key: 'bare-shaft', label: 'Bare Shaft', complete: false },
];

const MODULES = [
  {
    id: 'setup',
    label: 'Setup',
    description: '12-step bow setup',
    icon: <SlidersHorizontal size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/setup',
  },
  {
    id: 'form',
    label: 'Form',
    description: '8 components',
    icon: <Target size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/form',
  },
  {
    id: 'tuning',
    label: 'Tune',
    description: '6 standard methods',
    icon: <Crosshair size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/tuning',
  },
  {
    id: 'scoring',
    label: 'Score',
    description: 'ASA · IBO · NFAA',
    icon: <Award size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/scoring',
  },
  {
    id: 'shot-analyzer',
    label: 'Shot Analyzer',
    description: 'Log & analyze',
    icon: <Video size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/shot-analyzer',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${time}, ${name}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [bowSwitcherOpen, setBowSwitcherOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{getGreeting(ARCHER.name)}</Text>
            <Text style={styles.wordmark}>NOCKED</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.settingsBtn}
            hitSlop={12}
          >
            <Settings size={22} color={Colors.greyMid} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* ── Active bow chip ── */}
        <TouchableOpacity
          onPress={() => setBowSwitcherOpen(true)}
          activeOpacity={0.7}
          style={styles.bowChip}
        >
          <View>
            <Text style={styles.bowChipLabel}>Active Bow</Text>
            <Text style={styles.bowChipName}>{ACTIVE_BOW.nickname}</Text>
          </View>
          <ChevronDown size={16} color={Colors.greyMid} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* ── Last session card ── */}
        <Card style={styles.sessionCard}>
          <View style={styles.sessionRow}>
            <View>
              <Text style={styles.sessionMeta}>Last Session</Text>
              <Text style={styles.sessionModule}>{LAST_SESSION.module}</Text>
              <Text style={styles.sessionStep}>{LAST_SESSION.step}</Text>
            </View>
            <TouchableOpacity
              style={styles.continueBtn}
              activeOpacity={0.7}
              onPress={() => router.push(LAST_SESSION.route as any)}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
              <ChevronRight size={14} color={Colors.bgPrimary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* ── Module grid ── */}
        <Text style={styles.sectionLabel}>Modules</Text>
        <View style={styles.moduleGrid}>
          {MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              onPress={() => router.push(mod.route as any)}
              activeOpacity={0.75}
              style={styles.moduleCard}
            >
              <View style={styles.moduleIconWrap}>{mod.icon}</View>
              <Text style={styles.moduleLabel}>{mod.label}</Text>
              <Text style={styles.moduleDesc}>{mod.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tuning status ── */}
        <Text style={styles.sectionLabel}>Tuning Status</Text>
        <Card style={styles.statusCard}>
          {TUNING_STATUS.map((item) => (
            <View key={item.key} style={styles.statusRow}>
              {item.complete ? (
                <CheckCircle size={16} color={Colors.statusComplete} strokeWidth={1.5} />
              ) : (
                <Circle size={16} color={Colors.border} strokeWidth={1.5} />
              )}
              <Text style={[styles.statusLabel, item.complete && styles.statusLabelDone]}>
                {item.label}
              </Text>
            </View>
          ))}
        </Card>

        {/* ── Setup banner ── */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/setup')}
          style={styles.setupBanner}
        >
          <View style={styles.setupBannerBody}>
            <Text style={styles.setupBannerTitle}>Setup Recommended</Text>
            <Text style={styles.setupBannerText}>
              Walk through all 12 steps to establish a solid tuning baseline.
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>
      </ScrollView>

      {/* ── Bow switcher sheet ── */}
      <Modal visible={bowSwitcherOpen} animationType="slide" transparent>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheet} edges={['bottom']}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Bow</Text>
            {BOW_LIST.map((bow) => (
              <TouchableOpacity
                key={bow.id}
                onPress={() => setBowSwitcherOpen(false)}
                style={styles.bowOption}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={styles.bowOptionName}>{bow.nickname}</Text>
                  <Text style={styles.bowOptionDetail}>
                    {bow.manufacturer} · {bow.drawWeight} lbs · {bow.drawLength}"
                  </Text>
                </View>
                {bow.active && (
                  <Check size={16} color={Colors.clayDark} strokeWidth={2} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setBowSwitcherOpen(false)}
              style={styles.sheetCancel}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    marginBottom: 2,
  },
  wordmark: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxxl,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  settingsBtn: { padding: Spacing.xs, marginTop: Spacing.xs },

  bowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bowChipLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: 2,
  },
  bowChipName: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },

  sessionCard: { marginBottom: Spacing.lg },
  sessionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionMeta: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyLight, marginBottom: 3 },
  sessionModule: { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  sessionStep: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.textSecondary },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.clayDark,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  continueBtnText: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.bgPrimary },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  moduleCard: {
    width: '48%',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  moduleIconWrap: { marginBottom: Spacing.xs },
  moduleLabel: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.textPrimary },
  moduleDesc: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid },

  statusCard: { gap: Spacing.md, marginBottom: Spacing.xl },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  statusLabel: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.greyMid },
  statusLabelDone: { color: Colors.textPrimary },

  setupBanner: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  setupBannerBody: { flex: 1, gap: Spacing.xs },
  setupBannerTitle: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.bgPrimary },
  setupBannerText: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.bgSecondary, lineHeight: 18 },

  overlay: { flex: 1, backgroundColor: 'rgba(46,39,32,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sheetHandle: {
    width: 40, height: 3, backgroundColor: Colors.border,
    borderRadius: Radius.full, alignSelf: 'center', marginBottom: Spacing.md,
  },
  sheetTitle: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.greyMid, marginBottom: Spacing.md },
  bowOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  bowOptionName: { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  bowOptionDetail: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.greyMid },
  sheetCancel: { alignItems: 'center', paddingVertical: Spacing.lg },
  sheetCancelText: { ...Typography.label, fontSize: FontSizes.sm, color: Colors.greyMid },
});
