import { Post } from "../posts/post.model";


export interface BookmarksResponse {
  success: boolean;
  message: string;
  data: {
    bookmarks: Post[];
  };
  meta?: any;
}
