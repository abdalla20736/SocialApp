import { FollowingUser } from './following-user.model';

export interface FollowResponse {
  success: boolean;
  message: string;
  data: FollowingUser;
}
