import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, G, Rect } from 'react-native-svg';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

interface FormIllustrationProps {
  correct: React.ReactNode;
  incorrect: React.ReactNode;
  correctLabel?: string;
  incorrectLabel?: string;
}

export function FormIllustration({
  correct,
  incorrect,
  correctLabel = 'Correct',
  incorrectLabel = 'Incorrect',
}: FormIllustrationProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <View style={styles.svgWrapper}>{correct}</View>
        <Text style={styles.correctLabel}>{correctLabel}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.side}>
        <View style={styles.svgWrapper}>{incorrect}</View>
        <Text style={styles.incorrectLabel}>{incorrectLabel}</Text>
      </View>
    </View>
  );
}

// ─── Reusable Archer Body Parts ──────────────────────────────────────────────

const C = {
  body: Colors.clayDark,
  bodyLight: Colors.clayMid,
  accent: Colors.clayDarkest,
  error: Colors.statusError,
  bowString: Colors.greyMid,
  bg: Colors.bgSecondary,
};

// Basic standing archer silhouette — side view, facing right
export function StanceCorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head */}
      <Circle cx={50} cy={22} r={10} fill={C.body} />
      {/* Torso — upright */}
      <Line x1={50} y1={32} x2={50} y2={75} stroke={C.body} strokeWidth={3} strokeLinecap="round" />
      {/* Shoulders level */}
      <Line x1={35} y1={40} x2={65} y2={40} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Left leg */}
      <Line x1={50} y1={75} x2={38} y2={115} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={38} y1={115} x2={36} y2={130} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Right leg */}
      <Line x1={50} y1={75} x2={62} y2={115} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={62} y1={115} x2={64} y2={130} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Knee bend indicators */}
      <Circle cx={38} cy={115} r={2} fill={C.accent} />
      <Circle cx={62} cy={115} r={2} fill={C.accent} />
    </Svg>
  );
}

export function StanceIncorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head — leaning forward */}
      <Circle cx={55} cy={20} r={10} fill={C.error} />
      {/* Torso — leaning */}
      <Line x1={52} y1={30} x2={48} y2={75} stroke={C.error} strokeWidth={3} strokeLinecap="round" />
      {/* Shoulders raised/uneven */}
      <Line x1={33} y1={36} x2={67} y2={42} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      {/* Legs too narrow and locked */}
      <Line x1={48} y1={75} x2={44} y2={130} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={48} y1={75} x2={56} y2={130} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

// Grip — hand on bow
export function GripCorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Bow grip */}
      <Rect x={45} y={20} width={8} height={100} rx={4} fill={C.bodyLight} />
      {/* Hand — relaxed open fingers */}
      <Path d="M 53 60 Q 65 55 68 65 Q 70 72 63 75 Q 58 77 53 75" fill={C.body} />
      {/* Thumb pad contact */}
      <Circle cx={43} cy={65} r={6} fill={C.body} />
      {/* Relaxed fingers */}
      <Line x1={58} y1={68} x2={66} y2={72} stroke={C.body} strokeWidth={2} strokeLinecap="round" />
      <Line x1={57} y1={72} x2={64} y2={77} stroke={C.body} strokeWidth={2} strokeLinecap="round" />
      <Line x1={56} y1={76} x2={62} y2={82} stroke={C.body} strokeWidth={2} strokeLinecap="round" />
      {/* Contact point indicator */}
      <Circle cx={43} cy={65} r={3} fill={C.accent} opacity={0.5} />
    </Svg>
  );
}

export function GripIncorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Bow grip */}
      <Rect x={45} y={20} width={8} height={100} rx={4} fill={C.bodyLight} />
      {/* Hand — death grip, wrapped fingers */}
      <Path d="M 40 55 Q 35 60 38 70 Q 40 78 45 80 L 53 80 Q 60 78 62 70 Q 63 60 58 55 Z" fill={C.error} />
      {/* Wrapped fingers */}
      <Line x1={38} y1={62} x2={34} y2={66} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={38} y1={67} x2={33} y2={72} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={39} y1={72} x2={34} y2={78} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

// Draw — back tension archer at full draw
export function DrawCorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head */}
      <Circle cx={60} cy={28} r={9} fill={C.body} />
      {/* Torso */}
      <Line x1={55} y1={37} x2={52} y2={80} stroke={C.body} strokeWidth={3} strokeLinecap="round" />
      {/* Bow arm — slight bend */}
      <Line x1={45} y1={45} x2={15} y2={50} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bow shoulder DOWN */}
      <Circle cx={45} cy={45} r={3} fill={C.accent} />
      {/* Draw arm — elbow high */}
      <Line x1={60} y1={45} x2={75} y2={38} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={75} y1={38} x2={63} y2={30} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* String */}
      <Line x1={15} y1={30} x2={63} y2={30} stroke={C.bowString} strokeWidth={1} />
      <Line x1={15} y1={70} x2={15} y2={30} stroke={C.bodyLight} strokeWidth={2} />
      {/* Arrow */}
      <Line x1={15} y1={50} x2={63} y2={50} stroke={C.accent} strokeWidth={1.5} />
    </Svg>
  );
}

export function DrawIncorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head */}
      <Circle cx={60} cy={28} r={9} fill={C.error} />
      {/* Torso */}
      <Line x1={55} y1={37} x2={52} y2={80} stroke={C.error} strokeWidth={3} strokeLinecap="round" />
      {/* Raised bow shoulder */}
      <Circle cx={42} cy={38} r={3} fill={C.error} />
      {/* Bow arm — locked straight */}
      <Line x1={42} y1={38} x2={12} y2={48} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      {/* Draw arm — elbow LOW (arm pulling) */}
      <Line x1={60} y1={42} x2={78} y2={52} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={78} y1={52} x2={63} y2={30} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bow */}
      <Line x1={12} y1={28} x2={12} y2={68} stroke={C.bodyLight} strokeWidth={2} />
    </Svg>
  );
}

// Follow through
export function FollowThroughCorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head */}
      <Circle cx={55} cy={28} r={9} fill={C.body} />
      {/* Torso */}
      <Line x1={52} y1={37} x2={50} y2={80} stroke={C.body} strokeWidth={3} strokeLinecap="round" />
      {/* Bow arm — stays UP */}
      <Line x1={42} y1={45} x2={15} y2={48} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Release hand — fired BACKWARD toward shoulder */}
      <Line x1={60} y1={45} x2={78} y2={35} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={78} y1={35} x2={75} y2={25} stroke={C.body} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bow tilting forward */}
      <Line x1={12} y1={28} x2={18} y2={72} stroke={C.bodyLight} strokeWidth={2} />
      {/* Arrow direction */}
      <Line x1={15} y1={48} x2={0} y2={46} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />
    </Svg>
  );
}

export function FollowThroughIncorrect() {
  return (
    <Svg width={100} height={140} viewBox="0 0 100 140">
      <Rect x={0} y={0} width={100} height={140} rx={8} fill={C.bg} />
      {/* Head */}
      <Circle cx={55} cy={28} r={9} fill={C.error} />
      {/* Torso */}
      <Line x1={52} y1={37} x2={50} y2={80} stroke={C.error} strokeWidth={3} strokeLinecap="round" />
      {/* Bow arm dropped */}
      <Line x1={42} y1={45} x2={20} y2={65} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      {/* Dead hand — release hand didn't fire back */}
      <Line x1={60} y1={45} x2={65} y2={42} stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bow */}
      <Line x1={18} y1={48} x2={22} y2={85} stroke={C.bodyLight} strokeWidth={2} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  side: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 120,
    backgroundColor: Colors.borderLight,
  },
  correctLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.statusComplete,
  },
  incorrectLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.statusError,
  },
});
