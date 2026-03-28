import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

interface Props {
  isFollowing: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function FollowButton({ isFollowing, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, isFollowing ? styles.buttonFollowing : styles.buttonFollow]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text
        style={[styles.text, isFollowing ? styles.textFollowing : styles.textFollow]}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  buttonFollow: {
    backgroundColor: Colors.clayDark,
  },
  buttonFollowing: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.clayMid,
  },
  text: {
    ...Typography.label,
    fontSize: FontSizes.xs,
  },
  textFollow: {
    color: Colors.bgPrimary,
  },
  textFollowing: {
    color: Colors.clayDark,
  },
});
