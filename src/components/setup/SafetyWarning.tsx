import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface SafetyWarningProps {
  message: string;
}

export function SafetyWarning({ message }: SafetyWarningProps) {
  return (
    <View style={styles.container}>
      <AlertTriangle size={18} color={Colors.statusError} strokeWidth={1.5} />
      <View style={styles.content}>
        <Text style={styles.title}>Safety</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: '#F5E6E0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.statusError,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.statusError,
  },
  message: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
