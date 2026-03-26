import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface InstructionStepProps {
  number: number;
  title: string;
  description: string;
  checkable?: boolean;
  initialChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  warning?: string;
  note?: string;
}

export function InstructionStep({
  number,
  title,
  description,
  checkable = true,
  initialChecked = false,
  onCheckedChange,
  warning,
  note,
}: InstructionStepProps) {
  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = () => {
    if (!checkable) return;
    const next = !checked;
    setChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={checkable ? 0.7 : 1}
      style={styles.container}
    >
      {/* Number + check */}
      <View style={styles.leadingColumn}>
        {checkable ? (
          checked ? (
            <CheckCircle size={20} color={Colors.statusComplete} strokeWidth={1.5} />
          ) : (
            <Circle size={20} color={Colors.border} strokeWidth={1.5} />
          )
        ) : (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{number}</Text>
          </View>
        )}
        {/* Connector line */}
        <View style={styles.connector} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, checked && styles.titleComplete]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {warning && (
          <Text style={styles.warning}>{warning}</Text>
        )}
        {note && (
          <Text style={styles.note}>{note}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  leadingColumn: {
    alignItems: 'center',
    width: 24,
    paddingTop: 2,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.bgPrimary,
    letterSpacing: 0,
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  titleComplete: {
    color: Colors.greyLight,
  },
  description: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  warning: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.statusError,
    lineHeight: 16,
  },
  note: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
