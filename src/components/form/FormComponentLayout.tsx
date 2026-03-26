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
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

interface FormComponentLayoutProps {
  componentNumber: number;
  totalComponents: number;
  title: string;
  principle: string;
  children: React.ReactNode;
  nextRoute?: string;
  nextLabel?: string;
}

export function FormComponentLayout({
  componentNumber,
  totalComponents,
  title,
  principle,
  children,
  nextRoute,
  nextLabel,
}: FormComponentLayoutProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.counter}>
          {componentNumber} of {totalComponents}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.principleCard}>
          <Text style={styles.principleLabel}>Core Principle</Text>
          <Text style={styles.principleText}>{principle}</Text>
        </View>

        {children}

        {/* Next component navigation */}
        {nextRoute && (
          <TouchableOpacity
            onPress={() => router.push(nextRoute as any)}
            activeOpacity={0.7}
            style={styles.nextButton}
          >
            <View>
              <Text style={styles.nextLabel}>Next Component</Text>
              <Text style={styles.nextTitle}>{nextLabel}</Text>
            </View>
            <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
          </TouchableOpacity>
        )}
      </ScrollView>
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
  counter: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  principleCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  principleLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.xs,
  },
  principleText: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.clayDarkest,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.xl,
  },
  nextLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    marginBottom: 2,
  },
  nextTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.bgPrimary,
  },
});
