import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  ChevronRight,
  Award,
  TrendingUp,
  BookOpen,
  Crosshair,
  AlertTriangle,
  Check,
  MapPin,
} from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

type RoundType = 'Indoor' | 'Outdoor' | '3D' | 'Field' | 'Custom';

const ROUND_TYPES: RoundType[] = ['Indoor', 'Outdoor', '3D', 'Field', 'Custom'];

const FORMATS_BY_TYPE: Record<RoundType, string[]> = {
  Indoor:  ['Vegas (Single Spot)', 'Vegas Five Spot', 'NFAA Indoor (300)', 'USA Archery Indoor', 'World Archery Indoor', 'NASP', 'Custom'],
  Outdoor: ['NFAA Outdoor', 'USA Archery / World Archery (720)', 'Lancaster Archery Classic', 'Custom'],
  '3D':    ['ASA', 'IBO', 'NFAA 3D', 'Kill / Wound / Miss', 'Custom'],
  Field:   ['NFAA Field Round', 'NFAA Hunter Round', 'NFAA Animal Round', 'World Archery Field', 'Custom'],
  Custom:  ['Create Custom Format'],
};

interface FormatDetail {
  scoring: string;
  structure: string;
  maxScore: string;
  note?: string;
  isKWM?: boolean;
  isCustom?: boolean;
}

const FORMAT_DETAILS: Record<string, FormatDetail> = {
  'ASA':                               { scoring: '12 / 10 / 8 / Body = 5 / M', structure: '20 targets · 1 arrow each',      maxScore: '240 pts',       note: 'Body area outside rings = 5 pts — no 5-ring drawn' },
  'IBO':                               { scoring: '11 / 10 / 8 / Body = 5 / M', structure: '30 targets · 1 arrow each',      maxScore: '330 pts',       note: 'Body area outside rings = 5 pts — no 5-ring drawn' },
  'NFAA 3D':                           { scoring: '10 / 8 / Body = 5 / M',      structure: '28 targets · 1 arrow each',      maxScore: '280 pts' },
  'Kill / Wound / Miss':               { scoring: 'Kill +5 / Miss 0 / Wound −5', structure: 'Configurable targets',            maxScore: 'Variable',      isKWM: true, note: 'All values configurable. Wounds are penalized.' },
  'Vegas (Single Spot)':               { scoring: 'X / 10 / 9 / M',             structure: '10 ends · 3 arrows',              maxScore: '300 + X count', note: 'X tracked as tiebreaker' },
  'Vegas Five Spot':                   { scoring: 'X / 10 / 9 / M (×5)',         structure: '10 ends · 5 spots',               maxScore: '300 + X count', note: '5 spots scored independently per end' },
  'NFAA Indoor (300)':                 { scoring: '5 / 4 / 3 / 2 / 1 / M',      structure: '20 ends · 5 arrows',              maxScore: '300 pts' },
  'USA Archery Indoor':                { scoring: '10 / 9 / 8 … 1 / M',         structure: '10 ends · 3 arrows',              maxScore: '300 + X count' },
  'World Archery Indoor':              { scoring: '10 / 9 / 8 … 1 / M',         structure: '10 ends · 3 arrows',              maxScore: '300 + X count' },
  'NASP':                              { scoring: '5 / 4 / M',                   structure: '5 ends · 5 arrows each side',     maxScore: '300 pts' },
  'NFAA Outdoor':                      { scoring: '5 / 4 / 3 / 2 / 1 / M',      structure: '28 targets · 4 arrows',           maxScore: '560 pts' },
  'USA Archery / World Archery (720)': { scoring: '10 / 9 / 8 … 1 / M',         structure: '12 ends · 6 arrows',              maxScore: '720 + X count' },
  'Lancaster Archery Classic':         { scoring: 'X / 10 / 9 / M',             structure: '10 ends · 3 arrows',              maxScore: '300 + X count' },
  'NFAA Field Round':                  { scoring: '5 / 4 / 3 / 2 / 1 / M',      structure: '28 targets',                      maxScore: '560 pts' },
  'NFAA Hunter Round':                 { scoring: '5 / 4 / 3 / 2 / 1 / M',      structure: '28 targets',                      maxScore: '560 pts' },
  'NFAA Animal Round':                 { scoring: '5 / 4 / 3 / M',              structure: '28 targets',                      maxScore: '420 pts' },
  'World Archery Field':               { scoring: '6 / 5 / 4 / 3 / 2 / 1 / M',  structure: '24 targets',                      maxScore: '144 pts' },
  'Custom':                            { scoring: 'User defined',                structure: 'User defined',                    maxScore: 'User defined',  isCustom: true },
  'Create Custom Format':              { scoring: 'You define every ring, value, and label', structure: 'Ends or targets — your choice', maxScore: 'Fully configurable', isCustom: true },
};

const SAVED_COURSES = [
  { id: '1', name: 'Backwoods 3D Club — Main', targets: 20,   ends: null, format: 'ASA',                 location: 'Milltown, MT' },
  { id: '2', name: 'Indoor League Night',       targets: null, ends: 10,   format: 'Vegas (Single Spot)', location: 'Riverfront Archery' },
];

const RECENT_ROUNDS = [
  { id: '1', format: 'ASA',                 type: '3D',     date: 'Mar 24, 2026', total: 198, maxScore: 240 },
  { id: '2', format: 'IBO',                 type: '3D',     date: 'Mar 19, 2026', total: 267, maxScore: 330 },
  { id: '3', format: 'Vegas (Single Spot)', type: 'Indoor', date: 'Mar 14, 2026', total: 284, maxScore: 300 },
  { id: '4', format: 'Kill / Wound / Miss', type: '3D',     date: 'Mar 10, 2026', total: 35,  maxScore: 100 },
];

const PERSONAL_BESTS: { format: string; score: string }[] = [
  { format: 'ASA',                 score: '218' },
  { format: 'IBO',                 score: '282' },
  { format: 'Vegas (Single Spot)', score: '293 + 18X' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  pageTitle:    { ...Typography.displayBold, fontSize: FontSizes.xxl, color: Colors.textPrimary, marginBottom: 2 },
  pageSubtitle: { ...Typography.body,        fontSize: FontSizes.sm,  color: Colors.greyMid,    marginBottom: Spacing.xl },

  sectionLabel: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyLight, marginBottom: Spacing.md },

  // ── Round type selector ──
  roundTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  roundTypeChip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
  },
  roundTypeChipActive: { backgroundColor: Colors.clayDark, borderColor: Colors.clayDark },
  roundTypeLabel:      { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyMid },
  roundTypeLabelActive:{ color: Colors.bgPrimary },

  // ── Format list ──
  formatCard: { marginBottom: Spacing.lg, gap: 0, padding: 0, overflow: 'hidden' },
  formatRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  formatRowSelected: { backgroundColor: Colors.bgTertiary },
  formatLeft:        { flex: 1, gap: 2 },
  formatName:        { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  formatScoring:     { ...Typography.body,       fontSize: FontSizes.xs,   color: Colors.greyMid },
  formatBadge: {
    alignSelf: 'flex-start', paddingHorizontal: Spacing.xs, paddingVertical: 2,
    borderRadius: Radius.sm, backgroundColor: Colors.bgTertiary, marginTop: 2,
  },
  formatBadgeKWM:    { ...Typography.label, fontSize: FontSizes.xs - 1, color: Colors.clayMid },
  formatBadgeCustom: { ...Typography.label, fontSize: FontSizes.xs - 1, color: Colors.greyMid },

  // ── Inline detail panel ──
  detailPanel: {
    backgroundColor: Colors.bgTertiary, padding: Spacing.md,
    gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailKey: { ...Typography.label,       fontSize: FontSizes.xs, color: Colors.greyLight },
  detailVal: { ...Typography.bodyMedium,  fontSize: FontSizes.sm, color: Colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: Spacing.md },
  detailNote:{ ...Typography.body,        fontSize: FontSizes.xs, color: Colors.textSecondary, fontStyle: 'italic' },
  kwmNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs,
    backgroundColor: Colors.bgElevated, borderRadius: Radius.sm, padding: Spacing.sm,
  },
  kwmNoteText: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.textSecondary, flex: 1, lineHeight: 16 },
  startBtn: {
    backgroundColor: Colors.clayDark, borderRadius: Radius.lg, paddingVertical: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginTop: Spacing.xs,
  },
  startBtnText: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.bgPrimary, letterSpacing: 1 },

  // ── My Courses ──
  coursesCard:  { gap: 0, padding: 0, paddingHorizontal: Spacing.md, overflow: 'hidden', marginBottom: Spacing.xl },
  courseRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  courseBody:         { flex: 1, gap: 2 },
  courseName:         { ...Typography.bodyMedium, fontSize: FontSizes.sm, color: Colors.textPrimary },
  courseMeta:         { ...Typography.body,       fontSize: FontSizes.xs, color: Colors.greyMid },
  courseLocationRow:  { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  courseLocationText: { ...Typography.body,       fontSize: FontSizes.xs, color: Colors.greyLight },
  addCourseRow:  { paddingVertical: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  addCourseText: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.clayMid },

  // ── Personal bests ──
  pbRow:   { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  pbCard:  { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.md },
  pbScore: { ...Typography.displayBold, fontSize: FontSizes.lg,       color: Colors.textPrimary },
  pbLabel: { ...Typography.label,       fontSize: FontSizes.xs - 1,   color: Colors.greyMid, textAlign: 'center' },

  // ── Recent rounds ──
  roundCard: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.sm,
  },
  roundTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  roundLeft:       { gap: 2 },
  roundFormat:     { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  roundMeta:       { ...Typography.body,       fontSize: FontSizes.xs,   color: Colors.greyMid },
  roundScoreBlock: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  roundScore:      { ...Typography.displayBold, fontSize: FontSizes.xl, color: Colors.textPrimary },
  roundScoreMax:   { ...Typography.body,        fontSize: FontSizes.sm, color: Colors.greyMid, marginBottom: 2 },
  roundBar:        { height: 3, backgroundColor: Colors.borderLight, borderRadius: Radius.full, overflow: 'hidden' },
  roundBarFill:    { height: '100%', backgroundColor: Colors.clayMid, borderRadius: Radius.full },
  roundTypePill: {
    alignSelf: 'flex-start', paddingHorizontal: Spacing.xs, paddingVertical: 2,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  roundTypePillText: { ...Typography.label, fontSize: FontSizes.xs - 1, color: Colors.greyMid },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScoringScreen() {
  const [selectedType,   setSelectedType]   = useState<RoundType>('3D');
  const [selectedFormat, setSelectedFormat] = useState<string | null>('ASA');

  const formats = FORMATS_BY_TYPE[selectedType];

  function handleTypePress(type: RoundType) {
    setSelectedType(type);
    setSelectedFormat(null);
  }

  function handleFormatPress(fmt: string) {
    setSelectedFormat(selectedFormat === fmt ? null : fmt);
  }

  const detail = selectedFormat ? FORMAT_DETAILS[selectedFormat] : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Score" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Scoring</Text>
        <Text style={styles.pageSubtitle}>Indoor · Outdoor · 3D · Field · Custom</Text>

        {/* ── Round type ── */}
        <Text style={styles.sectionLabel}>ROUND TYPE</Text>
        <View style={styles.roundTypeRow}>
          {ROUND_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleTypePress(type)}
              activeOpacity={0.7}
              style={[styles.roundTypeChip, selectedType === type && styles.roundTypeChipActive]}
            >
              <Text style={[styles.roundTypeLabel, selectedType === type && styles.roundTypeLabelActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Format list ── */}
        <Text style={styles.sectionLabel}>SELECT FORMAT</Text>
        <Card style={styles.formatCard}>
          {formats.map((fmt, idx) => {
            const isSelected = selectedFormat === fmt;
            const info = FORMAT_DETAILS[fmt];
            return (
              <React.Fragment key={fmt}>
                <TouchableOpacity
                  onPress={() => handleFormatPress(fmt)}
                  activeOpacity={0.7}
                  style={[
                    styles.formatRow,
                    isSelected && styles.formatRowSelected,
                    idx === formats.length - 1 && !isSelected && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.formatLeft}>
                    <Text style={styles.formatName}>{fmt}</Text>
                    {info && <Text style={styles.formatScoring}>{info.scoring}</Text>}
                    {info?.isKWM && (
                      <View style={styles.formatBadge}>
                        <Text style={styles.formatBadgeKWM}>Bowhunter scoring</Text>
                      </View>
                    )}
                    {info?.isCustom && (
                      <View style={styles.formatBadge}>
                        <Text style={styles.formatBadgeCustom}>Fully configurable</Text>
                      </View>
                    )}
                  </View>
                  <ChevronRight
                    size={14}
                    color={isSelected ? Colors.clayDark : Colors.greyLight}
                    strokeWidth={isSelected ? 2 : 1.5}
                    style={{ transform: [{ rotate: isSelected ? '90deg' : '0deg' }] }}
                  />
                </TouchableOpacity>

                {isSelected && info && (
                  <View style={styles.detailPanel}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>Structure</Text>
                      <Text style={styles.detailVal}>{info.structure}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>Scoring</Text>
                      <Text style={styles.detailVal}>{info.scoring}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>Max Score</Text>
                      <Text style={styles.detailVal}>{info.maxScore}</Text>
                    </View>
                    {info.note && <Text style={styles.detailNote}>{info.note}</Text>}
                    {info.isKWM && (
                      <View style={styles.kwmNote}>
                        <AlertTriangle size={12} color={Colors.statusWarning} strokeWidth={1.5} />
                        <Text style={styles.kwmNoteText}>
                          Kill = inside the 8 ring. Wound = body hit outside scored rings (penalized). Miss = no target contact. All three values are fully configurable.
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity activeOpacity={0.85} style={styles.startBtn}>
                      <Text style={styles.startBtnText}>
                        {info.isCustom ? 'Build Custom Format' : `Start ${fmt} Round`}
                      </Text>
                      <ChevronRight size={16} color={Colors.bgPrimary} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </Card>

        {/* ── My Courses ── */}
        <Text style={styles.sectionLabel}>MY COURSES</Text>
        <Card style={styles.coursesCard}>
          {SAVED_COURSES.map((course, idx) => (
            <TouchableOpacity
              key={course.id}
              activeOpacity={0.7}
              style={[styles.courseRow, idx === SAVED_COURSES.length - 1 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.courseBody}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseMeta}>
                  {course.format}{course.targets ? ` · ${course.targets} targets` : course.ends ? ` · ${course.ends} ends` : ''}
                </Text>
                {course.location && (
                  <View style={styles.courseLocationRow}>
                    <MapPin size={10} color={Colors.greyLight} strokeWidth={1.5} />
                    <Text style={styles.courseLocationText}>{course.location}</Text>
                  </View>
                )}
              </View>
              <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addCourseRow} activeOpacity={0.7}>
            <Plus size={13} color={Colors.clayMid} strokeWidth={2} />
            <Text style={styles.addCourseText}>Build New Course</Text>
          </TouchableOpacity>
        </Card>

        {/* ── Personal Bests ── */}
        <Text style={styles.sectionLabel}>PERSONAL BESTS</Text>
        <View style={styles.pbRow}>
          {PERSONAL_BESTS.map((pb) => (
            <Card key={pb.format} style={styles.pbCard}>
              <Award size={14} color={Colors.clayMid} strokeWidth={1.5} />
              <Text style={styles.pbScore}>{pb.score}</Text>
              <Text style={styles.pbLabel}>{pb.format}</Text>
            </Card>
          ))}
        </View>

        {/* ── Recent Rounds ── */}
        <Text style={styles.sectionLabel}>RECENT ROUNDS</Text>
        {RECENT_ROUNDS.map((round) => {
          const pct = Math.round((round.total / round.maxScore) * 100);
          return (
            <TouchableOpacity key={round.id} activeOpacity={0.75} style={styles.roundCard}>
              <View style={styles.roundTop}>
                <View style={styles.roundLeft}>
                  <Text style={styles.roundFormat}>{round.format}</Text>
                  <Text style={styles.roundMeta}>{round.type} · {round.date}</Text>
                </View>
                <View style={styles.roundScoreBlock}>
                  <Text style={styles.roundScore}>{round.total}</Text>
                  <Text style={styles.roundScoreMax}>/ {round.maxScore}</Text>
                </View>
              </View>
              <View style={styles.roundBar}>
                <View style={[styles.roundBarFill, { width: `${pct}%` }]} />
              </View>
              <View style={styles.roundTypePill}>
                <Text style={styles.roundTypePillText}>{round.type}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
