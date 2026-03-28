import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  value: string | null;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  style?: ViewStyle;
}

export function Picker({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select…',
  optional = false,
  style,
}: PickerProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  const handleSelect = (val: string) => {
    onValueChange(val);
    setOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {optional && <Text style={styles.optional}>optional</Text>}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={styles.trigger}
      >
        <Text style={[styles.triggerText, !selectedLabel && styles.placeholder]}>
          {selectedLabel ?? placeholder}
        </Text>
        <ChevronDown size={18} color={Colors.greyMid} strokeWidth={1.5} />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheet} edges={['bottom']}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label ?? 'Select'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={styles.option}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Check size={16} color={Colors.clayDark} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    minHeight: 52,
  },
  triggerText: {
    fontFamily: 'Exo2_400Regular',
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: Colors.greyLight,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxHeight: '70%',
  },
  sheetHandle: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionText: {
    fontFamily: 'Exo2_400Regular',
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    fontFamily: 'Exo2_400Regular',
    color: Colors.clayDark,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
  cancelText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
});
