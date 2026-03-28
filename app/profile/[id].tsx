import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useSocialStore } from '@/store/useSocialStore';
import { ProfileHeader } from '@/components/social/ProfileHeader';
import { CommentSheet } from '@/components/social/CommentSheet';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ScoringRound } from '@/types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const myProfile = useAppStore((s) => s.archerProfile);
  const scoringRounds = useAppStore((s) => s.scoringRounds);

  const followArcher = useSocialStore((s) => s.followArcher);
  const unfollowArcher = useSocialStore((s) => s.unfollowArcher);
  const isFollowing = useSocialStore((s) => s.isFollowing);
  const getFollowerCount = useSocialStore((s) => s.getFollowerCount);
  const getFollowingCount = useSocialStore((s) => s.getFollowingCount);
  const likeSession = useSocialStore((s) => s.likeSession);
  const unlikeSession = useSocialStore((s) => s.unlikeSession);
  const isLiked = useSocialStore((s) => s.isLiked);
  const getLikeCount = useSocialStore((s) => s.getLikeCount);
  const addComment = useSocialStore((s) => s.addComment);
  const deleteComment = useSocialStore((s) => s.deleteComment);
  const getComments = useSocialStore((s) => s.getComments);

  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);

  if (!myProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </SafeAreaView>
    );
  }

  const isOwnProfile = id === myProfile.id || id === 'me';

  // For MVP, only own profile is navigable; community profiles will come with Supabase.
  // Profile data defaults to own profile if viewing own or unknown id.
  const profile = isOwnProfile ? myProfile : myProfile; // extend with lookup once backend exists

  const profileId = isOwnProfile ? myProfile.id : (id ?? myProfile.id);

  const following = isFollowing(myProfile.id, profileId);
  const followerCount = getFollowerCount(profileId);
  const followingCount = getFollowingCount(profileId);

  // Show only shared, completed rounds for this profile
  const profileRounds = scoringRounds
    .filter((r) => {
      const owner = r.archerId ?? myProfile.id;
      return owner === profileId && r.completed && r.isShared !== false;
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, 10); // show most recent 10

  const handleFollowToggle = () => {
    if (following) {
      unfollowArcher(myProfile.id, profileId);
    } else {
      followArcher(myProfile.id, profileId);
    }
  };

  const openComments = (sessionId: string) => setCommentTargetId(sessionId);
  const closeComments = () => setCommentTargetId(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Nav bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isOwnProfile ? 'My Profile' : profile.name}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <ProfileHeader
          profile={profile}
          followerCount={followerCount}
          followingCount={followingCount}
          roundCount={profileRounds.length}
          isOwnProfile={isOwnProfile}
          isFollowing={following}
          onFollowPress={handleFollowToggle}
          onEditPress={() => router.push('/profile/edit')}
        />

        {/* Recent sessions */}
        <Text style={styles.sectionLabel}>Recent Sessions</Text>

        {profileRounds.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No completed rounds yet.</Text>
          </View>
        )}

        {profileRounds.map((round) => (
          <RoundRow
            key={round.id}
            round={round}
            myId={myProfile.id}
            liked={isLiked(myProfile.id, round.id)}
            likeCount={getLikeCount(round.id)}
            commentCount={getComments(round.id).length}
            onLike={() => likeSession(myProfile.id, round.id)}
            onUnlike={() => unlikeSession(myProfile.id, round.id)}
            onCommentPress={() => openComments(round.id)}
            onPress={isOwnProfile
              ? () => router.push({ pathname: '/scoring/round-summary', params: { roundId: round.id } })
              : undefined
            }
          />
        ))}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Comment sheet */}
      {commentTargetId && (
        <CommentSheet
          visible={!!commentTargetId}
          comments={getComments(commentTargetId)}
          myId={myProfile.id}
          onClose={closeComments}
          onAddComment={(text) =>
            addComment(myProfile.id, myProfile.name, commentTargetId, text)
          }
          onDeleteComment={deleteComment}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Round row sub-component ──────────────────────────────────────────────────

interface RoundRowProps {
  round: ScoringRound;
  myId: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  onLike: () => void;
  onUnlike: () => void;
  onCommentPress: () => void;
  onPress?: () => void;
}

function RoundRow({
  round,
  liked,
  likeCount,
  commentCount,
  onLike,
  onUnlike,
  onCommentPress,
  onPress,
}: RoundRowProps) {
  const avg = round.avgPerTarget ??
    (round.totalTargets > 0 ? round.totalScore / round.totalTargets : 0);

  return (
    <TouchableOpacity
      style={styles.roundCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.roundHeader}>
        <View style={styles.roundBadge}>
          <Text style={styles.roundBadgeText}>{round.format}</Text>
        </View>
        <Text style={styles.roundDate}>{formatDate(round.date)}</Text>
      </View>

      <View style={styles.roundScoreRow}>
        <View style={styles.roundScoreBlock}>
          <Text style={styles.roundScoreValue}>{round.totalScore}</Text>
          <Text style={styles.roundScoreLabel}>Total</Text>
        </View>
        <View style={styles.roundScoreDivider} />
        <View style={styles.roundScoreBlock}>
          <Text style={styles.roundScoreValue}>{avg.toFixed(1)}</Text>
          <Text style={styles.roundScoreLabel}>Avg</Text>
        </View>
        <View style={styles.roundScoreDivider} />
        <View style={styles.roundScoreBlock}>
          <Text style={styles.roundScoreValue}>{round.totalTargets}</Text>
          <Text style={styles.roundScoreLabel}>Targets</Text>
        </View>
      </View>

      {round.location ? (
        <Text style={styles.roundLocation}>{round.location}</Text>
      ) : null}

      <View style={styles.roundActions}>
        {/* Like */}
        <TouchableOpacity
          style={[styles.actionChip, liked && styles.actionChipActive]}
          onPress={liked ? onUnlike : onLike}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Text style={[styles.actionChipText, liked && styles.actionChipTextActive]}>
            {liked ? '● ' : '○ '}
            {likeCount > 0 ? likeCount : 'Like'}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          style={styles.actionChip}
          onPress={onCommentPress}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Text style={styles.actionChipText}>
            {commentCount > 0 ? `${commentCount} Comment${commentCount !== 1 ? 's' : ''}` : 'Comment'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxxl },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },

  empty: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyLight,
  },

  errorText: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.greyMid,
    textAlign: 'center',
    marginTop: 80,
  },

  // Round card
  roundCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundBadge: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.sm,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  roundBadgeText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },
  roundDate: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  roundScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  roundScoreBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  roundScoreValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  roundScoreLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  roundScoreDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  roundLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  roundActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  actionChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  actionChipActive: {
    borderColor: Colors.clayMid,
    backgroundColor: Colors.clayDark,
  },
  actionChipText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  actionChipTextActive: {
    color: Colors.bgPrimary,
  },
});
