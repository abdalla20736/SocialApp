import { UserProfile } from "./user-profile.model";

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

