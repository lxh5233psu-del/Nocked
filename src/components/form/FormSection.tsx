import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

interface FormSectionProps {
  label: string;
  children: React.ReactNode;
}

export function FormSection({ label, children }: FormSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

interface FormStepProps {
  number: number;
  title: string;
  description: string;
  note?: string;
}

export function FormStep({ number, title, description, note }: FormStepProps) {
  return (
    <View style={styles.step}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
        {note && <Text style={styles.stepNote}>{note}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.bgPrimary,
    letterSpacing: 0,
  },
  stepContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  stepTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  stepDescription: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  stepNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
