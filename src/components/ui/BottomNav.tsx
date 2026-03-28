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
      {/*
        Outer wrapper has paddingTop to carve out space for the raised Score
        button, which is positioned absolutely at the top of this wrapper.
        overflow: visible lets the button poke above the visible bar area.
      */}
      <View style={styles.wrapper}>
        {/* ── Raised Score button ─────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/scoring')}
          activeOpacity={0.82}
          style={styles.scoreButton}
        >
          <Award size={26} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* ── Tab row ──────────────────────────────────────────────────── */}
        <View style={styles.bar}>
          {/* Left pair */}
          {LEFT_TABS.map((tab) => (
            <TabItem key={tab.label} tab={tab} />
          ))}

          {/* Centre gap — the Score button floats above this space */}
          <View style={styles.centerGap} />

          {/* Right pair */}
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
      activeOpacity={0.65}
      hitSlop={10}
      style={styles.tabItem}
    >
      <Icon size={22} color={Colors.clayMid} strokeWidth={1.5} />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SCORE_BUTTON_SIZE = 62;
const SCORE_PROTRUDE    = 22;   // how many px the button rises above the bar top
const BAR_HEIGHT        = 58;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bgSecondary,
  },

  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    // Top border gives a crisp edge
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    // Upward shadow — "lifts" the bar off the content
    ...Platform.select({
      ios: {
        shadowColor: Colors.clayDarkest,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 14,
      },
    }),
    // Extra top padding creates the space the score button floats into
    paddingTop: SCORE_PROTRUDE,
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

  // The gap in the centre of the tab row where Score floats above
  centerGap: {
    width: SCORE_BUTTON_SIZE + Spacing.xl,
  },

  // Raised circular Score button — positioned at the top of the wrapper,
  // centred horizontally, so it protrudes SCORE_PROTRUDE px above the bar line.
  scoreButton: {
    position: 'absolute',
    top: -(SCORE_BUTTON_SIZE / 2 - SCORE_PROTRUDE),
    alignSelf: 'center',
    width: SCORE_BUTTON_SIZE,
    height: SCORE_BUTTON_SIZE,
    borderRadius: SCORE_BUTTON_SIZE / 2,
    backgroundColor: Colors.clayDarkest,
    alignItems: 'center',
    justifyContent: 'center',
    // Downward shadow gives the raised-button depth
    ...Platform.select({
      ios: {
        shadowColor: Colors.clayDarkest,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
    // Keep it above the bar on z-axis
    zIndex: 10,
    // Ring detail — subtle border for separation from background
    borderWidth: 3,
    borderColor: Colors.bgPrimary,
  },
});
