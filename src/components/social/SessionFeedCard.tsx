import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { FeedItem } from '@/types/social';
import { LikeButton } from './LikeButton';

interface Props {
  item: FeedItem;
  myId: string;
  onLike: (sessionId: string) => void;
  onUnlike: (sessionId: string) => void;
  onCommentPress: (sessionId: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SessionFeedCard({ item, myId: _myId, onLike, onUnlike, onCommentPress }: Props) {
  const { round, likeCount, commentCount, isLikedByMe } = item;
  const avg = round.avgPerTarget ?? (round.totalTargets > 0 ? round.totalScore / round.totalTargets : 0);

  const handleCardPress = () => {
    // Navigate to the round summary for the current user's own rounds
    if (round.archerId === _myId) {
      router.push({ pathname: '/scoring/round-summary', params: { roundId: round.id } });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={round.archerId === _myId ? 0.7 : 1}
      style={styles.card}
    >
      {/* Header: archer name + date */}
      <View style={styles.headerRow}>
        <View style={styles.archerInfo}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarInitial}>
              {round.archerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.archerName}>{round.archerName}</Text>
            <Text style={styles.date}>{formatDate(round.date)}</Text>
          </View>
        </View>
        <View style={styles.formatBadge}>
          <Text style={styles.formatText}>{round.format}</Text>
        </View>
      </View>

      {/* Score summary */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreValue}>{round.totalScore}</Text>
          <Text style={styles.scoreLabel}>Total</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreValue}>{avg.toFixed(1)}</Text>
          <Text style={styles.scoreLabel}>Avg / Target</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreValue}>{round.totalTargets}</Text>
          <Text style={styles.scoreLabel}>Targets</Text>
        </View>
      </View>

      {/* Location */}
      {round.location ? (
        <Text style={styles.location}>{round.location}</Text>
      ) : null}

      {/* Actions row */}
      <View style={styles.actionsRow}>
        <LikeButton
          likeCount={likeCount}
          isLiked={isLikedByMe}
          onPress={() => isLikedByMe ? onUnlike(round.id) : onLike(round.id)}
        />

        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => onCommentPress(round.id)}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <MessageSquare size={14} color={Colors.greyMid} strokeWidth={1.5} />
          {commentCount > 0 && (
            <Text style={styles.commentCount}>{commentCount}</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  archerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayDark,
  },
  archerName: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  date: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  formatBadge: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.sm,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  formatText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
  },
  scoreBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  scoreValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  scoreLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  scoreDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },

  location: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  commentButton: {
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
  commentCount: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
});
