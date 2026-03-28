import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ArcherProfile, PreferredBowType } from '@/types';
import { FollowButton } from './FollowButton';

interface Props {
  profile: ArcherProfile;
  followerCount: number;
  followingCount: number;
  roundCount: number;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onEditPress?: () => void;
}

const BOW_TYPE_LABELS: Record<PreferredBowType, string> = {
  Compound: 'Compound',
  Recurve: 'Recurve',
  Traditional: 'Traditional',
  Crossbow: 'Crossbow',
};

export function ProfileHeader({
  profile,
  followerCount,
  followingCount,
  roundCount,
  isOwnProfile,
  isFollowing = false,
  onFollowPress,
  onFollowersPress,
  onFollowingPress,
  onEditPress,
}: Props) {
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>

      {/* Name + badge row */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{profile.name}</Text>
        {!profile.isPublic && (
          <View style={styles.privateBadge}>
            <Text style={styles.privateBadgeText}>Private</Text>
          </View>
        )}
      </View>

      {/* Bio */}
      {profile.bio ? (
        <Text style={styles.bio}>{profile.bio}</Text>
      ) : (
        isOwnProfile && (
          <TouchableOpacity onPress={onEditPress} hitSlop={8}>
            <Text style={styles.bioPlaceholder}>Add a bio →</Text>
          </TouchableOpacity>
        )
      )}

      {/* Metadata pills */}
      <View style={styles.pillRow}>
        {profile.experience && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{profile.experience}</Text>
          </View>
        )}
        {profile.preferredBowType && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{BOW_TYPE_LABELS[profile.preferredBowType]}</Text>
          </View>
        )}
        {profile.discipline && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{profile.discipline}</Text>
          </View>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem} onPress={onFollowersPress} activeOpacity={0.7}>
          <Text style={styles.statNumber}>{followerCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity style={styles.statItem} onPress={onFollowingPress} activeOpacity={0.7}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{roundCount}</Text>
          <Text style={styles.statLabel}>Rounds</Text>
        </View>
      </View>

      {/* CTA */}
      {isOwnProfile ? (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress} activeOpacity={0.7}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <FollowButton isFollowing={isFollowing} onPress={onFollowPress ?? (() => {})} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },

  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.clayDark,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  privateBadge: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.full,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privateBadgeText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  bio: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  bioPlaceholder: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },

  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    alignSelf: 'stretch',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  editButton: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.clayMid,
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },
});
