import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserProfile } from '../models/user/user-profile.model';
import { PostResponse } from '../models/posts/post-response.model';
import { Post } from '../models/posts/post.model';
import { SuggestedUser } from '../models/user/suggested-user.model';
import { SuggestionResponse } from '../models/user/suggestion-response.model';
import { SearchSuggestionResponse } from '../models/user/search-suggestion-response.model';
import { BookmarksResponse } from '../models/user/bookmarks-response.model';
import { FollowingUser } from '../models/user/following-user.model';
import { FollowResponse } from '../models/user/follow-response.model';
import { OwnerProfileResponse } from '../models/user/owner-profile-response.model';
import { UserProfileResponse } from '../models/user/user-profile-response.model';
import { OwnerProfile } from '../models/user/owner-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getOwnerProfile(): Observable<OwnerProfile> {
    return this.httpClient
      .get<OwnerProfileResponse>(`${this.baseUrl}/users/profile-data`)
      .pipe(map((response) => response.data.user));
  }

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.httpClient
      .get<UserProfileResponse>(`${this.baseUrl}/users/${userId}/profile`)
      .pipe(map((response) => response.data.user));
  }

  getUserPosts(userId: string): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/users/${userId}/posts`, {
        params: { page: '1', limit: '20' },
      })
      .pipe(map((response) => response.data.posts));
  }

  getBookMarksPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    return this.httpClient
      .get<BookmarksResponse>(`${this.baseUrl}/users/bookmarks`, {
        params: { page: page ? page.toString() : '1', limit: limit ? limit.toString() : '10' },
      })
      .pipe(map((response) => response.data.bookmarks));
  }

  getSuggestedUsers(page: number = 1, limit: number = 10): Observable<SuggestedUser[]> {
    return this.httpClient
      .get<SuggestionResponse>(`${this.baseUrl}/users/suggestions`, {
        params: { page: page ? page.toString() : '1', limit: limit ? limit.toString() : '10' },
      })
      .pipe(map((response: SuggestionResponse) => response.data.suggestions));
  }

  getSuggestedUsersBySearchTerm(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<SuggestedUser[]> {
    return this.httpClient
      .get<SearchSuggestionResponse>(`${this.baseUrl}/users/search`, {
        params: {
          q: searchTerm,
          page: page ? page.toString() : '1',
          limit: limit ? limit.toString() : '10',
        },
      })
      .pipe(map((response: SearchSuggestionResponse) => response.data.users));
  }

  followUser(userId: string): Observable<FollowingUser> {
    return this.httpClient
      .put<FollowResponse>(`${this.baseUrl}/users/${userId}/follow`, {})
      .pipe(map((response) => response.data));
  }

  updateProfilePhoto(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image, image.name);
    return this.httpClient.put(`${this.baseUrl}/users/upload-photo`, formData);
  }

  updateProfileCover(image: File, privacy: 'public' | 'only_me' | 'following'): Observable<any> {
    const formData = new FormData();
    formData.append('cover', image, image.name);
    formData.append('privacy', privacy);
    return this.httpClient.put(`${this.baseUrl}/users/upload-cover`, formData);
  }

  deleteProfileCover(): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/users/cover`);
  }
}
