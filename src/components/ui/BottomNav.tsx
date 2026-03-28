import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  SlidersHorizontal,
  Target,
  Award,
  Crosshair,
  Video,
} from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

// ─── Sizing constants ─────────────────────────────────────────────────────────

const SCORE_SIZE    = 50;   // diameter of the raised centre button
const SCORE_RISE    = 10;   // px the button protrudes above the bar line
const BAR_HEIGHT    = 46;   // height of the tab row itself
const ICON_SIZE     = 20;   // side-tab icon size
const SCORE_ICON    = 22;   // score button icon size

// ─── Tab config ───────────────────────────────────────────────────────────────

const LEFT_TABS = [
  { icon: SlidersHorizontal, route: '/setup',  label: 'Setup' },
  { icon: Target,            route: '/form',   label: 'Form'  },
] as const;

const RIGHT_TABS = [
  { icon: Crosshair, route: '/tuning',        label: 'Tune'     },
  { icon: Video,     route: '/shot-analyzer', label: 'Analyzer' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav() {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.wrapper}>

        {/*
          Inward-shadow simulation — three stacked translucent layers that
          concentrate at the very bottom edge, mimicking a gradient vignette
          rising from the bottom of the screen.
          pointerEvents="none" so they never intercept touches.
        */}
        <View style={[styles.shadowLayer, { height: 28 }]} pointerEvents="none" />
        <View style={[styles.shadowLayer, { height: 16 }]} pointerEvents="none" />
        <View style={[styles.shadowLayer, { height:  8 }]} pointerEvents="none" />

        {/* ── Raised Score button ──────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/scoring')}
          activeOpacity={0.80}
          style={styles.scoreButton}
        >
          <Award size={SCORE_ICON} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* ── Tab row ─────────────────────────────────────────────────── */}
        <View style={styles.bar}>
          {LEFT_TABS.map((tab) => (
            <TabItem key={tab.label} tab={tab} />
          ))}

          {/* Gap — the Score button hovers above this space */}
          <View style={styles.centerGap} />

          {RIGHT_TABS.map((tab) => (
            <TabItem key={tab.label} tab={tab} />
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─── TabItem ─────────────────────────────────────────────────────────────────

interface TabConfig {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  route: string;
  label: string;
}

function TabItem({ tab }: { tab: TabConfig }) {
  const Icon = tab.icon;
  return (
    <TouchableOpacity
      onPress={() => router.push(tab.route as any)}
      activeOpacity={0.55}
      hitSlop={12}
      style={styles.tabItem}
    >
      <Icon size={ICON_SIZE} color={Colors.clayDark} strokeWidth={1.5} />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    // Match bar colour so the safe-area extension below the bar is seamless
    backgroundColor: Colors.bgPrimary,
  },

  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    // Hairline separator + upward shadow to lift bar off screen content
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.clayLight,
    ...Platform.select({
      ios: {
        shadowColor: Colors.clayDarkest,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.10,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
    // paddingTop creates the headroom the Score button rises into
    paddingTop: SCORE_RISE,
    overflow: 'visible',
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: BAR_HEIGHT,
    paddingHorizontal: Spacing.md,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
  },

  centerGap: {
    // Slightly wider than the button so the icon never clips the ring
    width: SCORE_SIZE + Spacing.lg,
  },

  // Score button: sits at the very top of the wrapper, centred, and rises
  // SCORE_RISE px above the bar's top edge.
  scoreButton: {
    position: 'absolute',
    top: -(SCORE_SIZE / 2 - SCORE_RISE),
    alignSelf: 'center',
    width: SCORE_SIZE,
    height: SCORE_SIZE,
    borderRadius: SCORE_SIZE / 2,
    backgroundColor: Colors.clayDarkest,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    // Subtle ring border so the button reads against any scroll content
    borderWidth: 2.5,
    borderColor: Colors.bgPrimary,
    // Drop shadow beneath the button
    ...Platform.select({
      ios: {
        shadowColor: Colors.clayDarkest,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },

  // Each layer covers the full bar width and anchors to the bottom.
  // Stacking three layers concentrates opacity at the very bottom edge,
  // producing the inward-shadow-from-below gradient effect.
  shadowLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.clayDarkest,
    opacity: 0.055,
  },
});
