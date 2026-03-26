import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { Tool } from '@/types';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface ToolCheckProps {
  required: Tool[];
  optional?: Tool[];
}

export function ToolCheck({ required, optional = [] }: ToolCheckProps) {
  const toolInventory = useAppStore((s) => s.toolInventory);
  const hasTool = (tool: Tool) => toolInventory.includes(tool);
  const missingRequired = required.filter((t) => !hasTool(t));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Tools Required</Text>

      {required.map((tool) => {
        const owned = hasTool(tool);
        return (
          <View key={tool} style={styles.toolRow}>
            {owned ? (
              <Check size={14} color={Colors.statusComplete} strokeWidth={2} />
            ) : (
              <X size={14} color={Colors.statusError} strokeWidth={2} />
            )}
            <Text style={[styles.toolName, !owned && styles.toolMissing]}>
              {tool}
            </Text>
          </View>
        );
      })}

      {optional.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, styles.optionalLabel]}>Optional</Text>
          {optional.map((tool) => {
            const owned = hasTool(tool);
            return (
              <View key={tool} style={styles.toolRow}>
                {owned ? (
                  <Check size={14} color={Colors.statusComplete} strokeWidth={2} />
                ) : (
                  <View style={styles.dashIcon}>
                    <Text style={styles.dash}>–</Text>
                  </View>
                )}
                <Text style={styles.toolName}>{tool}</Text>
              </View>
            );
          })}
        </>
      )}

      {missingRequired.length > 0 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            You're missing {missingRequired.length === 1 ? 'a required tool' : `${missingRequired.length} required tools`}.
            You can still review instructions but may need a pro shop for this step.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.sm,
  },
  optionalLabel: {
    marginTop: Spacing.md,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  toolName: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  toolMissing: {
    color: Colors.statusError,
  },
  dashIcon: {
    width: 14,
    alignItems: 'center',
  },
  dash: {
    color: Colors.greyLight,
    fontSize: FontSizes.sm,
  },
  warningBox: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.statusWarning,
  },
  warningText: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
