import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

interface ErrorItem {
  error: string;
  consequence: string;
}

interface CommonErrorsProps {
  errors: ErrorItem[];
}

export function CommonErrors({ errors }: CommonErrorsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Errors</Text>
      {errors.map((item, i) => (
        <View key={i} style={styles.row}>
          <X size={14} color={Colors.statusError} strokeWidth={2} />
          <View style={styles.content}>
            <Text style={styles.errorText}>{item.error}</Text>
            <Text style={styles.consequence}>{item.consequence}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  errorText: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  consequence: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
