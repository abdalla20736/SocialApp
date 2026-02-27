import { UserProfile } from "./user-profile.model";

export interface MyProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

