import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoggedInUserResponse, UserProfile } from '../models/user-profile.model';
import { ChangePassword } from '../models/change-password.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private currentUserSubject: BehaviorSubject<UserProfile | null> =
    new BehaviorSubject<UserProfile | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  getLoggedInUser(): Observable<any> {
    return this.httpClient.get<LoggedInUserResponse>(`${this.baseUrl}/users/profile-data`).pipe(
      tap((response) => {
        this.setUser(response.user);
      }),
    );
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/users/change-password`, changePassword);
  }

  updateProfilePhoto(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image, image.name);
    return this.httpClient.put(`${this.baseUrl}/users/upload-photo`, formData);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): UserProfile | null {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as UserProfile) : null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }
}
