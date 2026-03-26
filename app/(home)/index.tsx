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
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ModuleType } from '@/types';

// ─── Module config ─────────────────────────────────────────────────────────────

interface ModuleConfig {
  id: ModuleType;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  phase2?: boolean;
}

const MODULES: ModuleConfig[] = [
  {
    id: 'Setup',
    label: 'Setup',
    description: '12-step bow setup',
    icon: <SlidersHorizontal size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/setup',
  },
  {
    id: 'Form',
    label: 'Form',
    description: '8 components',
    icon: <Target size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/form',
  },
  {
    id: 'Tune',
    label: 'Tune',
    description: '6 standard methods',
    icon: <Crosshair size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/tuning',
  },
  {
    id: 'Score',
    label: 'Score',
    description: 'ASA · IBO · NFAA',
    icon: <Award size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/(home)',
  },
  {
    id: 'Shot Analyzer',
    label: 'Shot Analyzer',
    description: 'Upload & review',
    icon: <Video size={22} color={Colors.clayDark} strokeWidth={1.5} />,
    route: '/(home)',
  },
];

// ─── Tuning status indicator ──────────────────────────────────────────────────

const STATUS_ITEMS = [
  { key: 'setup', label: 'Setup' },
  { key: 'sight-in', label: 'Sight-In' },
  { key: 'paper', label: 'Paper Tuning' },
  { key: 'walk-back', label: 'Walk-Back' },
  { key: 'bare-shaft', label: 'Bare Shaft' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const archerProfile = useAppStore((s) => s.archerProfile);
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const setActiveBow = useAppStore((s) => s.setActiveBow);
  const lastSession = useAppStore((s) => s.lastSession);

  const [bowSwitcherOpen, setBowSwitcherOpen] = useState(false);
  const activeBow = bowProfiles.find((b) => b.id === activeBowId);

  const greeting = getGreeting(archerProfile?.name);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.tagline}>NOCKED</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(home)')}
            style={styles.settingsButton}
            hitSlop={12}
          >
            <Settings size={22} color={Colors.greyMid} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Active bow switcher */}
        {bowProfiles.length > 0 && (
          <TouchableOpacity
            onPress={() => setBowSwitcherOpen(true)}
            activeOpacity={0.7}
            style={styles.bowSwitcher}
          >
            <View>
              <Text style={styles.bowSwitcherLabel}>Active Bow</Text>
              <Text style={styles.bowNickname}>
                {activeBow?.nickname ?? 'No bow selected'}
              </Text>
            </View>
            {bowProfiles.length > 1 && (
              <ChevronDown size={16} color={Colors.greyMid} strokeWidth={1.5} />
            )}
          </TouchableOpacity>
        )}

        {/* No bow yet */}
        {bowProfiles.length === 0 && (
          <Card variant="outlined" style={styles.noBowCard}>
            <Text style={styles.noBowText}>No bow profile set up yet.</Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/bow')}>
              <Text style={styles.noBowLink}>Add a bow →</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Last session card */}
        {lastSession && (
          <Card style={styles.sessionCard}>
            <View style={styles.sessionRow}>
              <View>
                <Text style={styles.sessionLabel}>Last Session</Text>
                <Text style={styles.sessionModule}>{lastSession.module}</Text>
                {lastSession.step && (
                  <Text style={styles.sessionStep}>{lastSession.step}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.continueButton} activeOpacity={0.7}>
                <Text style={styles.continueText}>Continue</Text>
                <ChevronRight size={14} color={Colors.bgPrimary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Module grid */}
        <Text style={styles.sectionLabel}>Modules</Text>
        <View style={styles.moduleGrid}>
          {MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              onPress={() => router.push(mod.route as any)}
              activeOpacity={0.7}
              style={styles.moduleCard}
            >
              <View style={styles.moduleIcon}>{mod.icon}</View>
              <Text style={styles.moduleLabel}>{mod.label}</Text>
              <Text style={styles.moduleDescription}>{mod.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tuning status */}
        {activeBow && (
          <>
            <Text style={styles.sectionLabel}>Tuning Status</Text>
            <Card style={styles.statusCard}>
              {STATUS_ITEMS.map((item) => {
                const isComplete =
                  item.key === 'setup'
                    ? activeBow.setupComplete
                    : activeBow.tuningModulesComplete.includes(item.key);
                return (
                  <View key={item.key} style={styles.statusRow}>
                    {isComplete ? (
                      <CheckCircle size={16} color={Colors.statusComplete} strokeWidth={1.5} />
                    ) : (
                      <Circle size={16} color={Colors.border} strokeWidth={1.5} />
                    )}
                    <Text
                      style={[
                        styles.statusLabel,
                        isComplete && styles.statusLabelComplete,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {/* Setup recommended banner */}
        {activeBow && !activeBow.setupComplete && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.setupBanner}
          >
            <View style={styles.setupBannerContent}>
              <Text style={styles.setupBannerTitle}>Setup Recommended</Text>
              <Text style={styles.setupBannerText}>
                Walk through all 12 steps to establish a solid tuning baseline.
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bow switcher modal */}
      <Modal visible={bowSwitcherOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Bow</Text>
            {bowProfiles.map((bow) => (
              <TouchableOpacity
                key={bow.id}
                onPress={() => {
                  setActiveBow(bow.id);
                  setBowSwitcherOpen(false);
                }}
                style={styles.bowOption}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={styles.bowOptionNickname}>{bow.nickname}</Text>
                  <Text style={styles.bowOptionDetail}>
                    {bow.manufacturer} · {bow.drawWeight} lbs · {bow.drawLength}"
                  </Text>
                </View>
                {bow.id === activeBowId && (
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // Top bar
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
  tagline: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxxl,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  settingsButton: {
    padding: Spacing.xs,
    marginTop: Spacing.xs,
  },

  // Bow switcher
  bowSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bowSwitcherLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: 2,
  },
  bowNickname: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },

  // No bow
  noBowCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  noBowText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  noBowLink: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },

  // Last session
  sessionCard: {
    marginBottom: Spacing.lg,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: 4,
  },
  sessionModule: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  sessionStep: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.clayDark,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  continueText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.bgPrimary,
  },

  // Section labels
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  // Module grid — 2+3 layout (2 top row, 3 bottom row)
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    // Make bottom row items fill 3 columns
    flexBasis: '48%',
  },
  moduleIcon: {
    marginBottom: Spacing.xs,
  },
  moduleLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  moduleDescription: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  // Tuning status
  statusCard: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  statusLabelComplete: {
    color: Colors.textPrimary,
  },

  // Setup banner
  setupBanner: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  setupBannerContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  setupBannerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
  },
  setupBannerText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.bgSecondary,
    lineHeight: 18,
  },

  // Bow switcher modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 39, 32, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    marginBottom: Spacing.md,
  },
  bowOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  bowOptionNickname: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bowOptionDetail: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  sheetCancel: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  sheetCancelText: {
    ...Typography.label,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
});
