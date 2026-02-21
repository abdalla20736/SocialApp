import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/posts/post.model';
import { PostResponse } from '../models/posts/post-response.model';
import { SinglePostResponse } from '../models/posts/single-post-response.model';
import { LikeResponse } from '../models/posts/like-response.model';
import { BookmarkResponse } from '../models/posts/bookmark-response.model';
import { Bookmark } from '../models/posts/bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  CreatePost(formData: FormData): Observable<Post> {
    return this.httpClient
      .post<SinglePostResponse>(`${this.baseUrl}/posts`, formData)
      .pipe(map((response) => response.data.post));
  }

  getHomeFeed(): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/posts/feed?only=following&limit=10`)
      .pipe(map((response) => response.data.posts));
  }

  getAllPosts(): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/posts`)
      .pipe(map((response) => response.data.posts));
  }
  getUserPosts(id: string): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/users/${id}/posts`)
      .pipe(map((response) => response.data.posts));
  }
  getSinglePost(id: string): Observable<Post> {
    return this.httpClient
      .get<SinglePostResponse>(`${this.baseUrl}/posts/${id}`)
      .pipe(map((response) => response.data.post));
  }
  updatePost(id: string, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/posts/${id}`, formData);
  }
  deletePost(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/posts/${id}`);
  }
  likePost(postId: string): Observable<Post> {
    return this.httpClient
      .put<LikeResponse>(`${this.baseUrl}/posts/${postId}/like`, {})
      .pipe(map((response) => response.data.post));
  }
  bookmarkPost(postId: string): Observable<Bookmark> {
    return this.httpClient
      .put<BookmarkResponse>(`${this.baseUrl}/posts/${postId}/bookmark`, {})
      .pipe(map((response) => response.data));
  }
  sharePost(postId: string): Observable<Post> {
    return this.httpClient
      .put<SinglePostResponse>(`${this.baseUrl}/posts/${postId}/share`, {})
      .pipe(map((response) => response.data.post));
  }
}
