import { Post } from './post.model';

export interface PostResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
  };
  meta?: any;
}
