import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface Props {
  likeCount: number;
  isLiked: boolean;
  onPress: () => void;
}

export function LikeButton({ likeCount, isLiked, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={8}
    >
      {/* Using a filled/outlined circle to represent like — stays within clay palette */}
      <View
        style={[
          styles.iconWrapper,
          isLiked && styles.iconWrapperActive,
        ]}
      >
        <Circle
          size={14}
          color={isLiked ? Colors.bgPrimary : Colors.greyMid}
          fill={isLiked ? Colors.clayDark : 'transparent'}
          strokeWidth={1.5}
        />
      </View>
      {likeCount > 0 && (
        <Text style={[styles.count, isLiked && styles.countActive]}>
          {likeCount}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: Colors.clayDark,
  },
  count: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  countActive: {
    color: Colors.clayDark,
  },
});
