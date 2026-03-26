import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Typography, FontSizes, Spacing } from '@/constants/theme';

const { height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
//  Welcome / Landing Screen
//
//  TODO: Replace the dark background with a full-screen bow hunter photo.
//  Swap the <View style={styles.photo} /> for:
//
//    import { ImageBackground } from 'react-native';
//    <ImageBackground source={require('../assets/welcome-bg.jpg')} style={styles.photo} />
//
//  Drop your photo into /assets/welcome-bg.jpg and the layout will be complete.
// ─────────────────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  return (
    <View style={styles.root}>

      {/* ── Photo / background ─────────────────────────────── */}
      {/* Replace this View with an ImageBackground once you have the photo */}
      <View style={styles.photo}>
        {/* Subtle horizon glow to suggest a sky / landscape */}
        <View style={styles.horizonGlow} />
      </View>

      {/* ── Gradient overlay (dark from bottom) ────────────── */}
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />
      <View style={styles.gradientLayer3} />
      <View style={styles.gradientLayer4} />

      {/* ── Content ────────────────────────────────────────── */}
      <SafeAreaView style={styles.safe} edges={['bottom', 'top']}>
        <View style={styles.content}>

          {/* Top spacer */}
          <View style={{ flex: 1 }} />

          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.wordmark}>NOCKED</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>Precision Bow Tuning &amp; Coaching</Text>
          </View>

          {/* Enter button */}
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            activeOpacity={0.8}
            style={styles.enterBtn}
          >
            <Text style={styles.enterBtnText}>Enter</Text>
            <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={2} />
          </TouchableOpacity>

          <View style={{ height: Spacing.xxxl }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.welcomeBg,
  },

  // Background photo placeholder
  photo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.welcomeBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Subtle lighter patch to suggest a distant sky / horizon
  horizonGlow: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    right: '10%',
    height: height * 0.22,
    backgroundColor: Colors.welcomeBgMid,
    borderRadius: 999,
    opacity: 0.5,
  },

  // Stacked semi-transparent layers that simulate a dark gradient
  // rising from the bottom — each gets progressively more opaque
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    top: '30%',
    backgroundColor: 'rgba(12,9,7,0.25)',
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    top: '48%',
    backgroundColor: 'rgba(12,9,7,0.45)',
  },
  gradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    top: '62%',
    backgroundColor: 'rgba(12,9,7,0.65)',
  },
  gradientLayer4: {
    ...StyleSheet.absoluteFillObject,
    top: '74%',
    backgroundColor: 'rgba(12,9,7,0.85)',
  },

  // Safe area container
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },

  // Title
  titleBlock: {
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  wordmark: {
    ...Typography.displayBold,
    fontSize: 64,
    color: '#FFFFFF',
    letterSpacing: 12,
    textAlign: 'center',
  },
  divider: {
    width: 48,
    height: 1.5,
    backgroundColor: Colors.clayLight,
    opacity: 0.7,
  },
  tagline: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // Enter button
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    alignSelf: 'center',
  },
  enterBtnText: {
    ...Typography.label,
    fontSize: FontSizes.base,
    color: Colors.bgPrimary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
