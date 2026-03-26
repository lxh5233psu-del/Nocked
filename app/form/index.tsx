import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Info, BookOpen } from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const RELEASE_TYPE = 'Wrist Strap';

const FORM_COMPONENTS = [
  {
    num: 1,
    title: 'Stance',
    summary: 'Foundation and stability',
    detail:
      'Square, open, or oblique stance — each affects torque and natural point of aim. Feet shoulder-width apart, weight balanced 60/40 toward the target foot.',
    tip: 'Check your NPOA by closing your eyes, drawing, and opening — the pin should land center with no rotation.',
    keyPoints: ['Foot position & width', 'Weight distribution', 'Natural point of aim'],
  },
  {
    num: 2,
    title: 'Grip & Bow Hand',
    summary: 'Contact, pressure, relaxation',
    detail:
      'The bow hand is the #1 source of torque. Pressure at the meat of the thumb pad only. Fingers relaxed and curled loosely — never gripping.',
    tip: 'After the shot the bow should fall forward out of your hand. If you are catching it mid-air, you are gripping.',
    keyPoints: ['Thumb pad pressure', 'Wrist angle', 'Finger tension'],
  },
  {
    num: 3,
    title: 'Draw & Back Tension',
    summary: 'Shoulder set, rhomboid engagement',
    detail:
      'Lead with the elbow, not the hand. The draw scapula should seat down and in before you reach full draw. Rhomboid engagement sustains the shot.',
    tip: 'Feel your draw shoulder blade move toward your spine as you come to anchor — not up toward your ear.',
    keyPoints: ['Scapula rotation', 'Draw elbow path', 'Rhomboid engagement'],
  },
  {
    num: 4,
    title: 'Anchor Point',
    summary: 'Contact points, consistency',
    detail:
      'Minimum three contact points: hand to face, string to nose, string to lips. The peep sight is a fourth. Every point must be identical shot to shot.',
    tip: 'Use the corner of your mouth and nose-to-string as quick-check anchors before settling into your peep.',
    keyPoints: ['Hand to jaw contact', 'String to nose/lip', 'Peep alignment'],
  },
  {
    num: 5,
    title: 'Peep & Sight Alignment',
    summary: 'Natural alignment, pin float',
    detail:
      'The sight housing should fill the peep circle with equal light on all sides. The pin should float naturally — do not chase it.',
    tip: 'If you are always adjusting the pin before the shot, your anchor is inconsistent — not your sight.',
    keyPoints: ['Peep-to-housing centering', 'Equal light aperture', 'Float acceptance'],
  },
  {
    num: 6,
    title: 'Release Technique',
    summary: 'Pull through, surprise break',
    detail: `For ${RELEASE_TYPE}: Maintain back tension through the break. Do not anticipate — let the shot surprise you. A punched trigger creates a flinch reflex that compresses over time.`,
    tip: 'If you can predict exactly when your release fires, you are punching. The break should feel like a surprise.',
    keyPoints: ['Back tension continuity', 'Surprise break', 'No punch/anticipation'],
  },
  {
    num: 7,
    title: 'Follow Through',
    summary: 'Diagnostic of shot execution',
    detail:
      'The follow-through is the outcome of everything before it. A perfect shot produces a bow-forward fall, draw arm back, and eyes on the target. Any deviation diagnoses the fault.',
    tip: 'Video your follow-through at least once per session. Your body lies to you — the camera does not.',
    keyPoints: ['Bow arm extension', 'Draw arm sweep', 'Head position'],
  },
  {
    num: 8,
    title: 'Breathing',
    summary: 'Timing, mantra, shot window',
    detail:
      'Exhale half your breath, then settle into your shot window — 4–8 seconds maximum. Beyond 8 seconds your vision degrades and muscles fatigue.',
    tip: 'Develop a consistent shot mantra: a mental word sequence that occupies your conscious mind and prevents over-thinking.',
    keyPoints: ['Half-exhale timing', '4–8 second window', 'Pre-shot routine'],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Form Module" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text style={styles.intro}>
          8 components of compound bow shooting form. Master each individually,
          then combine into a consistent shot sequence.
        </Text>

        {/* Release context chip */}
        <View style={styles.releaseChip}>
          <Info size={13} color={Colors.clayMid} strokeWidth={1.5} />
          <Text style={styles.releaseChipText}>
            Release-aware cues active for <Text style={styles.releaseChipBold}>{RELEASE_TYPE}</Text>
          </Text>
        </View>

        {/* Component list */}
        {FORM_COMPONENTS.map((comp) => {
          const isOpen = expanded === comp.num;
          return (
            <TouchableOpacity
              key={comp.num}
              onPress={() => setExpanded(isOpen ? null : comp.num)}
              activeOpacity={0.75}
              style={[styles.compRow, isOpen && styles.compRowOpen]}
            >
              {/* Number badge */}
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{comp.num}</Text>
              </View>

              {/* Main content */}
              <View style={styles.compContent}>
                <View style={styles.compTop}>
                  <View style={styles.compTitles}>
                    <Text style={styles.compTitle}>{comp.title}</Text>
                    <Text style={styles.compSummary}>{comp.summary}</Text>
                  </View>
                  <ChevronRight
                    size={16}
                    color={Colors.greyLight}
                    strokeWidth={1.5}
                    style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
                  />
                </View>

                {/* Expanded detail */}
                {isOpen && (
                  <View style={styles.compDetail}>
                    <Text style={styles.detailBody}>{comp.detail}</Text>

                    {/* Key points */}
                    <View style={styles.keyPoints}>
                      {comp.keyPoints.map((pt) => (
                        <View key={pt} style={styles.keyPointRow}>
                          <View style={styles.keyPointDot} />
                          <Text style={styles.keyPointText}>{pt}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Coaching tip */}
                    <Card variant="outlined" style={styles.tipCard}>
                      <View style={styles.tipHeader}>
                        <BookOpen size={12} color={Colors.clayMid} strokeWidth={1.5} />
                        <Text style={styles.tipLabel}>Coaching Tip</Text>
                      </View>
                      <Text style={styles.tipText}>{comp.tip}</Text>
                    </Card>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  intro: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  releaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.bgSecondary,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    marginBottom: Spacing.xl,
  },
  releaseChipText: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  releaseChipBold: {
    ...Typography.bodyMedium,
    color: Colors.clayMid,
  },

  compRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  compRowOpen: {
    backgroundColor: Colors.bgSecondary,
  },

  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
    letterSpacing: 0,
  },

  compContent: { flex: 1 },
  compTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compTitles: { flex: 1, paddingRight: Spacing.sm },
  compTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  compSummary: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },

  compDetail: { marginTop: Spacing.md, gap: Spacing.md },
  detailBody: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  keyPoints: { gap: Spacing.xs },
  keyPointRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  keyPointDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.clayLight,
  },
  keyPointText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  tipCard: { gap: Spacing.xs },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  tipLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs - 1,
    color: Colors.clayMid,
  },
  tipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
