import { Reply } from './reply.model';

export interface SingleReplyResponse {
  success: boolean;
  message: string;
  data: {
    reply: Reply;
  };
}
