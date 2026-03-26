import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface DiagnosisRow {
  condition: string;
  result: string;
  action: string;
}

interface DiagnosisTableProps {
  title: string;
  rows: DiagnosisRow[];
}

export function DiagnosisTable({ title, rows }: DiagnosisTableProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.conditionCol]}>Condition</Text>
        <Text style={[styles.headerCell, styles.resultCol]}>Result</Text>
        <Text style={[styles.headerCell, styles.actionCol]}>Action</Text>
      </View>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[styles.row, i % 2 === 0 && styles.rowEven]}
        >
          <Text style={[styles.cell, styles.conditionCol]}>{row.condition}</Text>
          <Text style={[styles.cell, styles.resultCol]}>{row.result}</Text>
          <Text style={[styles.cell, styles.actionCol]}>{row.action}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  title: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerCell: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
  },
  rowEven: {
    backgroundColor: Colors.bgSecondary,
  },
  cell: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    lineHeight: 16,
  },
  conditionCol: {
    flex: 2,
  },
  resultCol: {
    flex: 2,
  },
  actionCol: {
    flex: 3,
  },
});
