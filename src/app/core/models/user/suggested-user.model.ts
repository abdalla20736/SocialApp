export interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount?: number;
  followersCount?: number;
  followed?: boolean;
}
