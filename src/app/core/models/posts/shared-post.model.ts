import { User } from '../auth/user.model';
import { TopComment } from '../comments/comment-top.model';

export interface SharedPost {
  _id: string;
  body?: string;
  privacy: string;
  user: User;
  sharedPost?: SharedPost;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  image?: string;
}
