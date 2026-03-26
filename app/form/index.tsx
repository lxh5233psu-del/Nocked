import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

const FORM_COMPONENTS = [
  { num: 1, title: 'Stance', route: '/form/stance', summary: 'Foundation and stability' },
  { num: 2, title: 'Grip & Bow Hand', route: '/form/grip', summary: 'Contact, pressure, relaxation' },
  { num: 3, title: 'Draw & Back Tension', route: '/form/draw', summary: 'Shoulder set, rhomboid engagement' },
  { num: 4, title: 'Anchor Point', route: '/form/anchor', summary: 'Contact points, consistency' },
  { num: 5, title: 'Peep & Sight Alignment', route: '/form/peep-alignment', summary: 'Natural alignment, pin float' },
  { num: 6, title: 'Release Technique', route: '/form/release', summary: 'Pull through, surprise break' },
  { num: 7, title: 'Follow Through', route: '/form/follow-through', summary: 'Diagnostic of shot execution' },
  { num: 8, title: 'Breathing', route: '/form/breathing', summary: 'Timing, mantra, window' },
];

export default function FormHubScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Form Module</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          8 components of compound bow shooting form. Master each individually,
          then combine into a consistent shot sequence.
        </Text>

        {FORM_COMPONENTS.map((comp) => (
          <TouchableOpacity
            key={comp.num}
            onPress={() => router.push(comp.route as any)}
            activeOpacity={0.7}
            style={styles.componentRow}
          >
            <View style={styles.componentNum}>
              <Text style={styles.numText}>{comp.num}</Text>
            </View>
            <View style={styles.componentContent}>
              <Text style={styles.componentTitle}>{comp.title}</Text>
              <Text style={styles.componentSummary}>{comp.summary}</Text>
            </View>
            <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  subtitle: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  componentNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
    letterSpacing: 0,
  },
  componentContent: { flex: 1 },
  componentTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  componentSummary: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
});
