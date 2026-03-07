import { Comment } from '../comments/comment.model';
import { Reply } from './reply.model';

export interface ReplyResponse {
  success: boolean;
  message: string;
  data: {
    replies: Reply[];
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
