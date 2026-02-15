export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  createdAt: string;
}

export interface LoggedInUserResponse {
  message?: string;
  user: UserProfile;
}
