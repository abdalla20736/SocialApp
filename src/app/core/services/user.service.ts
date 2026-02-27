import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { MyProfileResponse } from '../models/user/my-profile-response.model';
import { UserProfile } from '../models/user/user-profile.model';
import { PostResponse } from '../models/posts/post-response.model';
import { Post } from '../models/posts/post.model';
import { SuggestedUser } from '../models/user/suggested-user.model';
import { SuggestionResponse } from '../models/user/suggestion-response.model';
import { SearchSuggestionResponse } from '../models/user/search-suggestion-response.model';
import { User } from '../models/auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getMyProfile(): Observable<UserProfile> {
    return this.httpClient
      .get<MyProfileResponse>(`${this.baseUrl}/users/profile-data`)
      .pipe(map((response) => response.data.user));
  }
  getUserPosts(id: string): Observable<Post[]> {
    return this.httpClient
      .get<PostResponse>(`${this.baseUrl}/users/${id}/posts`)
      .pipe(map((response) => response.data.posts));
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

  followUser(userId: string): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/users/${userId}/follow`, {});
  }

  updateProfilePhoto(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image, image.name);
    return this.httpClient.put(`${this.baseUrl}/users/upload-photo`, formData);
  }
}
