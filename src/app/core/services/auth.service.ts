import { ChangePasswordPayload } from './../models/auth/change-password.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SigninRequest, SigninResponse, SignupRequest } from '../models/auth/auth.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_COOKIE_NAME = 'token';
  private readonly TOKEN_EXPIRY_COOKIE_NAME = 'token_expiry';

  private readonly baseUrl = environment.baseUrl;
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    this.getStoredUser(),
  );
  currentUser$ = this.currentUserSubject.asObservable();

  register(userData: SignupRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/users/signup`, userData);
  }

  login(credentails: SigninRequest): Observable<SigninResponse> {
    return this.httpClient.post<SigninResponse>(`${this.baseUrl}/users/signin`, credentails).pipe(
      tap((response) => {
        const expiryDuration = this.parseDuration(response.data.expiresIn);
        const expiryTimestamp = Date.now() + expiryDuration;

        // Calculate expiry in days for cookie
        const expiryDays = expiryDuration / (24 * 60 * 60 * 1000);

        // Set cookies with expiration and path
        this.cookieService.set(this.TOKEN_COOKIE_NAME, response.data.token, expiryDays, '/');
        this.cookieService.set(
          this.TOKEN_EXPIRY_COOKIE_NAME,
          expiryTimestamp.toString(),
          expiryDays,
          '/',
        );
        this.setUser(response.data.user);
      }),
    );
  }
  logout(): void {
    this.cookieService.delete(this.TOKEN_COOKIE_NAME, '/');
    this.cookieService.delete(this.TOKEN_EXPIRY_COOKIE_NAME, '/');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  changePassword(changePasswordData: ChangePasswordPayload): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/users/change-password`, changePasswordData);
  }

  getToken(): string {
    const token = this.cookieService.get(this.TOKEN_COOKIE_NAME);

    if (!token || this.isTokenExpired()) {
      this.cookieService.delete(this.TOKEN_COOKIE_NAME, '/');
      this.cookieService.delete(this.TOKEN_EXPIRY_COOKIE_NAME, '/');
      return '';
    }

    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value!;
  }

  private isTokenExpired(): boolean {
    const expiryTimestamp = this.cookieService.get(this.TOKEN_EXPIRY_COOKIE_NAME);

    if (!expiryTimestamp) {
      return true; // No expiry stored, consider expired
    }

    return Date.now() >= parseInt(expiryTimestamp);
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as User) : null;
  }

  private parseDuration(duration: string): number {
    if (!duration) return 0;

    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: { [key: string]: number } = {
      d: 24 * 60 * 60 * 1000, // days to milliseconds
      h: 60 * 60 * 1000, // hours to milliseconds
      m: 60 * 1000, // minutes to milliseconds
      s: 1000, // seconds to milliseconds
    };

    return value * (multipliers[unit] || 0);
  }
}
