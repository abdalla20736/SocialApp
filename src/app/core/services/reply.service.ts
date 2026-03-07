import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SingleReplyResponse } from '../models/replies/single-reply-response.model';
import { Reply } from '../models/replies/reply.model';
import { ReplyResponse } from '../models/replies/reply-response.model';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getAllRepliesByCommentId(
    postId: string,
    commentId: string,
    limit: number = 10,
    page: number = 1,
  ): Observable<Reply[]> {
    return this.httpClient
      .get<ReplyResponse>(`${this.baseUrl}/posts/${postId}/comments/${commentId}/replies`, {
        params: { page, limit },
      })
      .pipe(map((response: ReplyResponse) => response.data.replies));
  }

  createReply(
    postId: string,
    commentId: string,
    content?: string,
    imgFile?: File,
  ): Observable<Reply> {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (imgFile) formData.append('image', imgFile);

    return this.httpClient
      .post<SingleReplyResponse>(
        `${this.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
        formData,
      )
      .pipe(map((response: SingleReplyResponse) => response.data.reply));
  }
}
