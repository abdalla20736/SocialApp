import { Bookmark } from "./bookmark.model";

export interface BookmarkResponse {
  success: boolean;
  message: string;
  data: Bookmark;
}
