import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Wrench,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function SettingsHubScreen() {
  const archerProfile = useAppStore((s) => s.archerProfile);
  const discipline = useAppStore((s) => s.discipline);
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const toolInventory = useAppStore((s) => s.toolInventory);
  const releaseProfile = useAppStore((s) => s.releaseProfile);
  const units = useAppStore((s) => s.units);
  const setUnits = useAppStore((s) => s.setUnits);
  const formRemindersEnabled = useAppStore((s) => s.formRemindersEnabled);
  const setFormRemindersEnabled = useAppStore((s) => s.setFormRemindersEnabled);
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);

  const handleResetApp = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all profiles, sessions, rounds, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Archer */}
        <Text style={styles.sectionLabel}>Archer</Text>
        <View style={styles.group}>
          <SettingsRow
            icon={<User size={18} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Profile"
            value={archerProfile ? `${archerProfile.name} · ${archerProfile.handedness}` : 'Not set'}
            onPress={() => router.push('/settings/profile')}
          />
          <Divider />
          <SettingsRow
            label="Discipline"
            value={discipline ?? 'Not set'}
            onPress={() => router.push('/settings/profile')}
          />
        </View>

        {/* Equipment */}
        <Text style={styles.sectionLabel}>Equipment</Text>
        <View style={styles.group}>
          <SettingsRow
            icon={<SlidersHorizontal size={18} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Bows"
            value={`${bowProfiles.length} bow${bowProfiles.length !== 1 ? 's' : ''}`}
            onPress={() => router.push('/settings/bows')}
          />
          <Divider />
          <SettingsRow
            label="Release"
            value={releaseProfile ? `${releaseProfile.type}${releaseProfile.brand ? ` · ${releaseProfile.brand}` : ''}` : 'Not set'}
            onPress={() => router.push('/settings/profile')}
          />
        </View>

        {/* Tools */}
        <Text style={styles.sectionLabel}>Tools</Text>
        <View style={styles.group}>
          <SettingsRow
            icon={<Wrench size={18} color={Colors.clayMid} strokeWidth={1.5} />}
            label="Tool Inventory"
            value={`${toolInventory.length} of 19 tools`}
            onPress={() => router.push('/settings/tools')}
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Units</Text>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                onPress={() => setUnits('Imperial')}
                style={[styles.unitOption, units === 'Imperial' && styles.unitOptionActive]}
              >
                <Text style={[styles.unitOptionText, units === 'Imperial' && styles.unitOptionTextActive]}>
                  Imperial
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnits('Metric')}
                style={[styles.unitOption, units === 'Metric' && styles.unitOptionActive]}
              >
                <Text style={[styles.unitOptionText, units === 'Metric' && styles.unitOptionTextActive]}>
                  Metric
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Divider />
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Form Reminders</Text>
              <Text style={styles.rowSub}>Prompt form review at session start</Text>
            </View>
            <Switch
              value={formRemindersEnabled}
              onValueChange={setFormRemindersEnabled}
              trackColor={{ false: Colors.border, true: Colors.clayMid }}
              thumbColor={Colors.bgPrimary}
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <Divider />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Build</Text>
            <Text style={styles.rowValue}>Sprint 8</Text>
          </View>
        </View>

        {/* Danger zone */}
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.group}>
          <TouchableOpacity onPress={handleResetApp} activeOpacity={0.7} style={styles.row}>
            <RotateCcw size={18} color={Colors.statusError} strokeWidth={1.5} />
            <Text style={styles.dangerLabel}>Reset All App Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.row}
      disabled={!onPress}
    >
      {icon && <View style={styles.rowIcon}>{icon}</View>}
      <Text style={[styles.rowLabel, icon ? styles.rowLabelWithIcon : undefined]}>{label}</Text>
      {value && <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>}
      {onPress && <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  group: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52,
  },
  rowIcon: { width: 22, alignItems: 'center' },
  rowContent: { flex: 1 },
  rowLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  rowLabelWithIcon: { flex: 1 },
  rowSub: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },
  rowValue: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    maxWidth: '40%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.md,
  },

  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  unitOption: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  unitOptionActive: {
    backgroundColor: Colors.clayDark,
  },
  unitOptionText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  unitOptionTextActive: {
    color: Colors.bgPrimary,
  },

  dangerLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.statusError,
  },
});
