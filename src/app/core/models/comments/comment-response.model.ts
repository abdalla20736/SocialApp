import { Comment } from './comment.model';
export interface CommentResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
  };
  meta: {
    pagination: Pagination;
  };
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}
