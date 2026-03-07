export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
  username?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  id?: string;
}
