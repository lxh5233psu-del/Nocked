import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { Tool, ALL_TOOLS } from '@/types';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function ToolsScreen() {
  const setToolInventory = useAppStore((s) => s.setToolInventory);
  const existing = useAppStore((s) => s.toolInventory);
  const [selected, setSelected] = useState<Set<Tool>>(new Set(existing));

  const toggle = (tool: Tool) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tool)) {
        next.delete(tool);
      } else {
        next.add(tool);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelected(new Set(ALL_TOOLS));
  };

  const handleContinue = () => {
    setToolInventory(Array.from(selected));
    router.push('/onboarding/bow');
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={8}
      title="Tool Inventory"
      subtitle="Select the tools you currently have. Don't worry — we'll show you what's possible with what you own. Adjustable anytime in Settings."
    >
      <TouchableOpacity onPress={handleSelectAll} style={styles.selectAll}>
        <Text style={styles.selectAllText}>Select All</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {ALL_TOOLS.map((tool) => {
          const isSelected = selected.has(tool);
          return (
            <TouchableOpacity
              key={tool}
              onPress={() => toggle(tool)}
              activeOpacity={0.7}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              {isSelected && (
                <Check size={12} color={Colors.bgPrimary} strokeWidth={2.5} />
              )}
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {tool}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button label="Continue" onPress={handleContinue} />
        <Button
          label="Skip for Now"
          variant="ghost"
          onPress={() => {
            setToolInventory([]);
            router.push('/onboarding/bow');
          }}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  selectAll: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  selectAllText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: Colors.clayDark,
    borderColor: Colors.clayDark,
  },
  chipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  chipTextSelected: {
    color: Colors.bgPrimary,
  },
  actions: {
    gap: Spacing.sm,
  },
});
