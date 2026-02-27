import { User } from '../auth/user.model';
import { TopComment } from '../comments/comment-top.model';
import { SharedPost } from './shared-post.model';

export interface Post {
  _id: string;
  body: string;
  image: string;
  privacy: 'public' | 'following' | 'only_me';
  user: User;
  sharedPost: SharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}
