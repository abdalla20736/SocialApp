import { CommentCreator } from '../comments/comment-creator.model';

export interface Reply {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string;
  likes: any[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}
