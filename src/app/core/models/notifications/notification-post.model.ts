import { TopComment } from "../comments/comment-top.model";

export interface NotificationPost {
  _id: string;
  body?: string;
  user?: string;
  commentsCount?: number;
  topComment?: TopComment;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  id?: string;
  name?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  unavailable?: boolean;
}
