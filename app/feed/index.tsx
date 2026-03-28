import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, ChevronLeft } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useSocialStore } from '@/store/useSocialStore';
import { SessionFeedCard } from '@/components/social/SessionFeedCard';
import { CommentSheet } from '@/components/social/CommentSheet';
import { Colors, Typography, Spacing, FontSizes, Radius } from '@/constants/theme';
import { FeedItem } from '@/types/social';

export default function FeedScreen() {
  const myProfile = useAppStore((s) => s.archerProfile);
  const scoringRounds = useAppStore((s) => s.scoringRounds);

  const feedItems = useSocialStore((s) => s.feedItems);
  const feedHasMore = useSocialStore((s) => s.feedHasMore);
  const isLoadingFeed = useSocialStore((s) => s.isLoadingFeed);
  const loadFeed = useSocialStore((s) => s.loadFeed);
  const refreshFeed = useSocialStore((s) => s.refreshFeed);
  const likeSession = useSocialStore((s) => s.likeSession);
  const unlikeSession = useSocialStore((s) => s.unlikeSession);
  const addComment = useSocialStore((s) => s.addComment);
  const deleteComment = useSocialStore((s) => s.deleteComment);
  const getComments = useSocialStore((s) => s.getComments);

  const [refreshing, setRefreshing] = useState(false);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);

  const myId = myProfile?.id ?? '';

  // Build a name map from all rounds (future: from Supabase user list)
  const archerNameMap: Record<string, string> = {};
  if (myProfile) archerNameMap[myProfile.id] = myProfile.name;

  const loadInitial = useCallback(() => {
    if (!myId) return;
    loadFeed(myId, scoringRounds, archerNameMap, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, scoringRounds]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshFeed(myId, scoringRounds, archerNameMap);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (feedHasMore && !isLoadingFeed) {
      loadFeed(myId, scoringRounds, archerNameMap, false);
    }
  };

  const renderItem = ({ item }: { item: FeedItem }) => (
    <SessionFeedCard
      item={item}
      myId={myId}
      onLike={(sessionId) => likeSession(myId, sessionId)}
      onUnlike={(sessionId) => unlikeSession(myId, sessionId)}
      onCommentPress={(sessionId) => setCommentTargetId(sessionId)}
    />
  );

  const renderFooter = () => {
    if (!isLoadingFeed) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={Colors.clayMid} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Your feed is quiet</Text>
      <Text style={styles.emptyBody}>
        Follow other archers to see their sessions here. Your own completed rounds always appear too.
      </Text>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push({ pathname: '/profile/[id]', params: { id: 'me' } })}
        activeOpacity={0.7}
      >
        <User size={14} color={Colors.bgPrimary} strokeWidth={1.5} />
        <Text style={styles.profileButtonText}>View My Profile</Text>
      </TouchableOpacity>
    </View>
  );

  if (!myProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.noProfile}>
          Complete onboarding to access your feed.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Feed</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/profile/[id]', params: { id: myProfile.id } })}
          hitSlop={12}
          style={styles.profileIconButton}
        >
          <User size={20} color={Colors.clayDark} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.round.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={
          feedItems.length === 0 ? styles.listEmpty : styles.listContent
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.clayMid}
            colors={[Colors.clayMid]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Comment sheet */}
      {commentTargetId && (
        <CommentSheet
          visible={!!commentTargetId}
          comments={getComments(commentTargetId)}
          myId={myId}
          onClose={() => setCommentTargetId(null)}
          onAddComment={(text) =>
            addComment(myId, myProfile.name, commentTargetId, text)
          }
          onDeleteComment={deleteComment}
        />
      )}
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
  profileIconButton: {
    padding: Spacing.xs,
  },

  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
    lineHeight: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.clayDark,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  profileButtonText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.bgPrimary,
  },

  loadingFooter: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  noProfile: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
    marginTop: 80,
  },
});
