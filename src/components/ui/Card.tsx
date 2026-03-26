import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'outlined' && styles.outlined,
        variant === 'elevated' && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevated: {
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.bgElevated,
  },
});
