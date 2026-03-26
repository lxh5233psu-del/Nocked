import React from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ScalePressProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  disabled?: boolean;
}

/**
 * Pressable with a native-thread spring scale animation on press.
 * Drops in as a direct replacement for TouchableOpacity where
 * tactile feedback matters (scoring buttons, primary CTAs).
 */
export function ScalePress({
  children,
  onPress,
  style,
  activeScale = 0.93,
  disabled = false,
}: ScalePressProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(activeScale, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      disabled={disabled}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
