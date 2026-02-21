import { Post } from './post.model';

export interface SinglePostResponse {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}
