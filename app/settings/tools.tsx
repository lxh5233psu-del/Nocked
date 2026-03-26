import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { ALL_TOOLS, Tool } from '@/types';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function ToolsSettingsScreen() {
  const toolInventory = useAppStore((s) => s.toolInventory);
  const setToolInventory = useAppStore((s) => s.setToolInventory);

  const [selected, setSelected] = useState<Tool[]>(toolInventory);

  const toggle = (tool: Tool) => {
    setSelected((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const selectAll = () => setSelected([...ALL_TOOLS]);
  const clearAll = () => setSelected([]);

  const handleSave = () => {
    setToolInventory(selected);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tool Inventory</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Select all / clear */}
      <View style={styles.bulkRow}>
        <Text style={styles.countText}>
          {selected.length} of {ALL_TOOLS.length} selected
        </Text>
        <View style={styles.bulkActions}>
          <TouchableOpacity onPress={selectAll} hitSlop={8}>
            <Text style={styles.bulkAction}>All</Text>
          </TouchableOpacity>
          <Text style={styles.bulkSep}>·</Text>
          <TouchableOpacity onPress={clearAll} hitSlop={8}>
            <Text style={styles.bulkAction}>None</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hint}>
          Marking tools you own lets the app warn you before steps that require equipment you don't have.
        </Text>

        {ALL_TOOLS.map((tool, i) => {
          const isSelected = selected.includes(tool);
          const isLast = i === ALL_TOOLS.length - 1;
          return (
            <TouchableOpacity
              key={tool}
              onPress={() => toggle(tool)}
              activeOpacity={0.7}
              style={[styles.toolRow, !isLast && styles.toolRowBorder]}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Check size={12} color={Colors.bgPrimary} strokeWidth={2.5} />}
              </View>
              <Text style={[styles.toolName, isSelected && styles.toolNameSelected]}>
                {tool}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button label="Save Inventory" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  countText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  bulkActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bulkAction: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },
  bulkSep: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg },

  hint: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  toolRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgPrimary,
  },
  checkboxSelected: {
    borderColor: Colors.clayDark,
    backgroundColor: Colors.clayDark,
  },
  toolName: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    flex: 1,
  },
  toolNameSelected: {
    color: Colors.textPrimary,
  },

  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
});
