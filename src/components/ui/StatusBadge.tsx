import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

interface StatusBadgeProps {
  label: string;
  variant?: 'complete' | 'warning' | 'info' | 'neutral';
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.label, styles[`${variant}Text` as keyof typeof styles] as any]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.label,
    fontSize: FontSizes.xs,
  },
  // Dark mode badge backgrounds — deep tinted surfaces
  neutral:  { backgroundColor: Colors.bgTertiary },
  complete: { backgroundColor: '#1A3A1A' },
  warning:  { backgroundColor: '#3A2A0A' },
  info:     { backgroundColor: '#0A2030' },
  neutralText:  { color: Colors.greyMid },
  completeText: { color: Colors.statusComplete },
  warningText:  { color: Colors.statusWarning },
  infoText:     { color: Colors.statusInfo },
});
