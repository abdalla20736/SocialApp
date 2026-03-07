import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Comment } from '../models/comments/comment.model';
import { CommentResponse } from '../models/comments/comment-response.model';
import { SingleCommentResponse } from '../models/comments/single-comments-response.model';
import { CommentReplyForm } from '../models/comments/comment-reply-form.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getAllCommentsByPostId(
    postId: string,
    limit: number = 10,
    page: number = 1,
  ): Observable<Comment[]> {
    return this.httpClient
      .get<CommentResponse>(`${this.baseUrl}/posts/${postId}/comments`, {
        params: { page, limit },
      })
      .pipe(map((response: CommentResponse) => response.data.comments));
  }

  createComment(postId: string, payload: CommentReplyForm): Observable<Comment> {
    const formData = new FormData();
    if (payload.content) formData.append('content', payload.content);
    if (payload.image) formData.append('image', payload.image);

    return this.httpClient
      .post<SingleCommentResponse>(`${this.baseUrl}/posts/${postId}/comments`, formData)
      .pipe(map((response: SingleCommentResponse) => response.data.comment));
  }

  updateComment(postId: string, commentId: string, content: string): Observable<Comment> {
    const formData = new FormData();
    formData.append('content', content);

    return this.httpClient
      .put<SingleCommentResponse>(`${this.baseUrl}/posts/${postId}/comments/${commentId}`, formData)
      .pipe(map((response: SingleCommentResponse) => response.data.comment));
  }

  deleteComment(postId: string, commentId: string): Observable<Comment> {
    return this.httpClient
      .delete<SingleCommentResponse>(`${this.baseUrl}/posts/${postId}/comments/${commentId}`)
      .pipe(map((response: SingleCommentResponse) => response.data.comment));
  }

  toggleCommentLike(postId: string, commentId: string): Observable<Comment> {
    return this.httpClient
      .put<SingleCommentResponse>(`${this.baseUrl}/posts/${postId}/comments/${commentId}/like`, {})
      .pipe(map((response: SingleCommentResponse) => response.data.comment));
  }
}
