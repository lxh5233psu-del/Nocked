import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          {/* Topographic mountain mark — SVG placeholder until logo is finalized */}
          <View style={styles.logoMark}>
            <View style={styles.mountain3} />
            <View style={styles.mountain2} />
            <View style={styles.mountain1} />
          </View>
          <Text style={styles.wordmark}>NOCKED</Text>
          <Text style={styles.tagline}>Bow Tuning · Coaching · Scoring</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="Get Started"
            onPress={() => router.push('/onboarding/profile')}
          />
          <Button
            label="I Already Have an Account"
            variant="ghost"
            onPress={() => {
              // Phase 2 — accounts not implemented in MVP
              router.push('/onboarding/profile');
            }}
          />
        </View>

        <Text style={styles.legal}>
          Free forever. No account required.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  logoMark: {
    width: 80,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  // Layered mountain planes — topographic silhouette
  mountain1: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 35,
    backgroundColor: Colors.clayDarkest,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  mountain2: {
    position: 'absolute',
    bottom: 10,
    width: 58,
    height: 26,
    backgroundColor: Colors.clayDark,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
  },
  mountain3: {
    position: 'absolute',
    bottom: 20,
    width: 36,
    height: 20,
    backgroundColor: Colors.clayMid,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  wordmark: {
    ...Typography.displayBold,
    fontSize: FontSizes.display,
    color: Colors.textPrimary,
    letterSpacing: 8,
  },
  tagline: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  legal: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    textAlign: 'center',
  },
});
