export interface User {
  _id: string;
  name: string;
  username?: string;
  photo: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}
