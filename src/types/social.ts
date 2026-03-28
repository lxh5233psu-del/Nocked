import { ScoringRound } from './index';

// ─── Social Graph ─────────────────────────────────────────────────────────────

export interface SocialFollow {
  id: string;
  /** The archer doing the following */
  followerId: string;
  /** The archer being followed */
  followingId: string;
  createdAt: number;
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export interface SessionLike {
  id: string;
  sessionId: string;
  archerId: string;
  createdAt: number;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface SessionComment {
  id: string;
  sessionId: string;
  archerId: string;
  archerName: string;
  text: string;
  createdAt: number;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export interface FeedItem {
  round: ScoringRound & { archerName: string };
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
}

export interface FeedPage {
  items: FeedItem[];
  hasMore: boolean;
  nextOffset: number;
}

export const FEED_PAGE_SIZE = 10;
