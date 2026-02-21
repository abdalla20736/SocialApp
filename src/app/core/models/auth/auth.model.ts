import { User } from './user.model';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresIn: string;
    user: User;
  };
}
