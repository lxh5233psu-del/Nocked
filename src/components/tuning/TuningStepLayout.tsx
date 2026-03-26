import React from 'react';
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
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface TuningStepLayoutProps {
  title: string;
  subtitle?: string;
  prerequisite?: string;
  children: React.ReactNode;
  onComplete: () => void;
  completeLabel?: string;
  canComplete?: boolean;
  showComplete?: boolean;
}

export function TuningStepLayout({
  title,
  subtitle,
  prerequisite,
  children,
  onComplete,
  completeLabel = 'Mark Complete & Continue',
  canComplete = true,
  showComplete = true,
}: TuningStepLayoutProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.topLabel}>Tuning</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {prerequisite && (
          <View style={styles.prereqCard}>
            <Text style={styles.prereqLabel}>Prerequisite</Text>
            <Text style={styles.prereqText}>{prerequisite}</Text>
          </View>
        )}

        {children}

        {/* Spacer for bottom button */}
        {showComplete && <View style={{ height: 80 }} />}
      </ScrollView>

      {/* Fixed bottom button */}
      {showComplete && (
        <View style={styles.bottomBar}>
          <Button
            label={completeLabel}
            onPress={onComplete}
            disabled={!canComplete}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  backButton: {
    padding: Spacing.xs,
  },
  topLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  prereqCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.clayMid,
  },
  prereqLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.xs,
  },
  prereqText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
});
