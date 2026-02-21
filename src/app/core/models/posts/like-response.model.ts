import { Like } from './like.model';

export interface LikeResponse {
  success: boolean;
  message: string;
  data: Like;
}
