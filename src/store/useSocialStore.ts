import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SocialFollow,
  SessionLike,
  SessionComment,
  FeedItem,
  FEED_PAGE_SIZE,
} from '@/types/social';
import { ScoringRound } from '@/types';
import { generateId } from '@/utils/id';

// ─── State ────────────────────────────────────────────────────────────────────

interface SocialState {
  follows: SocialFollow[];
  likes: SessionLike[];
  comments: SessionComment[];

  // Feed pagination
  feedItems: FeedItem[];
  feedOffset: number;
  feedHasMore: boolean;
  isLoadingFeed: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface SocialActions {
  // Follow graph
  followArcher: (myId: string, followingId: string) => void;
  unfollowArcher: (myId: string, followingId: string) => void;
  isFollowing: (myId: string, followingId: string) => boolean;
  getFollowerCount: (archerId: string) => number;
  getFollowingCount: (myId: string) => number;
  getFollowingIds: (myId: string) => string[];

  // Likes
  likeSession: (myId: string, sessionId: string) => void;
  unlikeSession: (myId: string, sessionId: string) => void;
  isLiked: (myId: string, sessionId: string) => boolean;
  getLikeCount: (sessionId: string) => number;

  // Comments
  addComment: (archerId: string, archerName: string, sessionId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  getComments: (sessionId: string) => SessionComment[];

  // Feed — build from scoring rounds + social graph
  loadFeed: (
    myId: string,
    allRounds: ScoringRound[],
    archerNameMap: Record<string, string>,
    reset?: boolean
  ) => void;
  refreshFeed: (
    myId: string,
    allRounds: ScoringRound[],
    archerNameMap: Record<string, string>
  ) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a sorted, paginated slice of feed-eligible rounds.
 *
 * Eligible = completed + (isShared !== false) + authored by followed archers
 * or the current user themselves.
 */
function buildFeedSlice(
  myId: string,
  followingIds: string[],
  allRounds: ScoringRound[],
  archerNameMap: Record<string, string>,
  likes: SessionLike[],
  offset: number
): { slice: FeedItem[]; hasMore: boolean } {
  const eligibleIds = new Set([myId, ...followingIds]);

  const eligible = allRounds
    .filter((r) => {
      const authorId = r.archerId ?? myId; // legacy rounds without archerId belong to current user
      return r.completed && r.isShared !== false && eligibleIds.has(authorId);
    })
    .sort((a, b) => b.date - a.date);

  const pageItems = eligible.slice(offset, offset + FEED_PAGE_SIZE);
  const hasMore = offset + FEED_PAGE_SIZE < eligible.length;

  const slice: FeedItem[] = pageItems.map((round) => {
    const authorId = round.archerId ?? myId;
    const roundLikes = likes.filter((l) => l.sessionId === round.id);
    return {
      round: {
        ...round,
        archerName: archerNameMap[authorId] ?? 'Unknown',
      },
      likeCount: roundLikes.length,
      commentCount: 0, // filled at render time for simplicity
      isLikedByMe: roundLikes.some((l) => l.archerId === myId),
    };
  });

  return { slice, hasMore };
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: SocialState = {
  follows: [],
  likes: [],
  comments: [],
  feedItems: [],
  feedOffset: 0,
  feedHasMore: false,
  isLoadingFeed: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSocialStore = create<SocialState & SocialActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Follow graph ───────────────────────────────────────────────────────

      followArcher: (myId, followingId) => {
        if (myId === followingId) return;
        if (get().isFollowing(myId, followingId)) return;
        const follow: SocialFollow = {
          id: generateId(),
          followerId: myId,
          followingId,
          createdAt: Date.now(),
        };
        set((s) => ({ follows: [...s.follows, follow] }));
      },

      unfollowArcher: (myId, followingId) =>
        set((s) => ({
          follows: s.follows.filter(
            (f) => !(f.followerId === myId && f.followingId === followingId)
          ),
        })),

      isFollowing: (myId, followingId) =>
        get().follows.some((f) => f.followerId === myId && f.followingId === followingId),

      getFollowerCount: (archerId) =>
        get().follows.filter((f) => f.followingId === archerId).length,

      getFollowingCount: (myId) =>
        get().follows.filter((f) => f.followerId === myId).length,

      getFollowingIds: (myId) =>
        get().follows.filter((f) => f.followerId === myId).map((f) => f.followingId),

      // ── Likes ───────────────────────────────────────────────────────────────

      likeSession: (myId, sessionId) => {
        if (get().isLiked(myId, sessionId)) return;
        const like: SessionLike = {
          id: generateId(),
          sessionId,
          archerId: myId,
          createdAt: Date.now(),
        };
        set((s) => ({ likes: [...s.likes, like] }));
      },

      unlikeSession: (myId, sessionId) =>
        set((s) => ({
          likes: s.likes.filter(
            (l) => !(l.archerId === myId && l.sessionId === sessionId)
          ),
        })),

      isLiked: (myId, sessionId) =>
        get().likes.some((l) => l.archerId === myId && l.sessionId === sessionId),

      getLikeCount: (sessionId) =>
        get().likes.filter((l) => l.sessionId === sessionId).length,

      // ── Comments ────────────────────────────────────────────────────────────

      addComment: (archerId, archerName, sessionId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const comment: SessionComment = {
          id: generateId(),
          sessionId,
          archerId,
          archerName,
          text: trimmed,
          createdAt: Date.now(),
        };
        set((s) => ({ comments: [...s.comments, comment] }));
      },

      deleteComment: (commentId) =>
        set((s) => ({
          comments: s.comments.filter((c) => c.id !== commentId),
        })),

      getComments: (sessionId) =>
        get()
          .comments.filter((c) => c.sessionId === sessionId)
          .sort((a, b) => a.createdAt - b.createdAt),

      // ── Feed ────────────────────────────────────────────────────────────────

      loadFeed: (myId, allRounds, archerNameMap, reset = false) => {
        const currentOffset = reset ? 0 : get().feedOffset;
        const followingIds = get().getFollowingIds(myId);

        set({ isLoadingFeed: true });

        const { slice, hasMore } = buildFeedSlice(
          myId,
          followingIds,
          allRounds,
          archerNameMap,
          get().likes,
          currentOffset
        );

        // Attach live comment counts
        const itemsWithCounts: FeedItem[] = slice.map((item) => ({
          ...item,
          commentCount: get().comments.filter((c) => c.sessionId === item.round.id).length,
        }));

        set((s) => ({
          feedItems: reset ? itemsWithCounts : [...s.feedItems, ...itemsWithCounts],
          feedOffset: currentOffset + slice.length,
          feedHasMore: hasMore,
          isLoadingFeed: false,
        }));
      },

      refreshFeed: (myId, allRounds, archerNameMap) => {
        get().loadFeed(myId, allRounds, archerNameMap, true);
      },
    }),
    {
      name: 'nocked-social-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the source-of-truth data; feed is derived and rebuilt on load
      partialize: (s) => ({
        follows: s.follows,
        likes: s.likes,
        comments: s.comments,
      }),
    }
  )
);
