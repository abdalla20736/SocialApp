import { Comment } from './comment.model';
export interface SingleCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment: Comment;
  };
}
