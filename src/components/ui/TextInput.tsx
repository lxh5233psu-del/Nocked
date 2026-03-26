import React from 'react';
import {
  TextInput as RNTextInput,
  Text,
  View,
  StyleSheet,
  KeyboardTypeOptions,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
  optional?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'go' | 'search';
  onSubmitEditing?: () => void;
}

export function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  hint,
  optional = false,
  style,
  inputStyle,
  autoCapitalize = 'sentences',
  returnKeyType,
  onSubmitEditing,
}: TextInputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {optional && <Text style={styles.optional}>optional</Text>}
        </View>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.greyLight}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        style={[styles.input, inputStyle]}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  optional: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgPrimary,
    fontFamily: 'Raleway_400Regular',
    fontSize: FontSizes.base,
    minHeight: 52,
  },
  hint: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
});
