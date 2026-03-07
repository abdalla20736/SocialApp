import { User } from "../auth/user.model";

export interface UserProfile {
  cover: string;
  following: string[];
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  createdAt: string;
  followers: User[];
  bookmarks: string[];
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
