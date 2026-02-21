import { Post } from './post.model';

export interface Like {
  liked: boolean;
  likesCount: number;
  post: Post;
}
