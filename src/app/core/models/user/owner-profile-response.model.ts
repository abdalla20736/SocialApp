import { OwnerProfile } from './owner-profile.model';

export interface OwnerProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: OwnerProfile;
  };
}
