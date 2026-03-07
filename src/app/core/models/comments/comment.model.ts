import { CommentCreator } from './comment-creator.model';

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
  repliesCount: number;
}
