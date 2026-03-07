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
import { AuthService } from './auth.service';
import { Privacy } from '../../shared/types/privacy.type';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = environment.baseUrl;

  createPost(postContent: string, postImg: File, privacy: Privacy): Observable<Post> {
    const formData = new FormData();
    if (postContent) formData.append('body', postContent);
    if (postImg) formData.append('image', postImg);
    formData.append('privacy', privacy);

    return this.httpClient
      .post<SinglePostResponse>(`${this.baseUrl}/posts`, formData)
      .pipe(map((response) => response.data.post));
  }

  getFilteredHomeFeed(filter = 'following'): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/posts/feed?only=${filter}&limit=20`)
      .pipe(map((response) => response.data.posts));
  }

  getAllPosts(): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/posts`)
      .pipe(map((response) => response.data.posts));
  }

  getSinglePost(id: string): Observable<Post> {
    return this.httpClient
      .get<SinglePostResponse>(`${this.baseUrl}/posts/${id}`)
      .pipe(map((response) => response.data.post));
  }
  updatePost(id: string, privacy?: Privacy, content?: string): Observable<Post> {
    const formData = new FormData();
    if (privacy) formData.append('privacy', privacy);
    if (content) formData.append('body', content);

    return this.httpClient
      .put<SinglePostResponse>(`${this.baseUrl}/posts/${id}`, formData)
      .pipe(map((response) => response.data.post));
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
  sharePost(postId: string, body?: string): Observable<Post> {
    const trimmedBody = body?.trim();
    const payload = trimmedBody ? { body: trimmedBody } : {};

    return this.httpClient
      .post<SinglePostResponse>(`${this.baseUrl}/posts/${postId}/share`, payload)
      .pipe(map((response) => response.data.post));
  }

  isPostOwner(post?: Post): boolean {
    const currentUser = this.authService.getCurrentUser();
    return post?.user?._id === currentUser?._id;
  }
}
