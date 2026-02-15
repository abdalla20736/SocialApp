import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { SigninRequest, SigninResponse, SignupRequest } from '../models/auth.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_COOKIE_NAME = 'token';
  private baseUrl = environment.baseUrl;
  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  register(userData: SignupRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/users/signup`, userData);
  }
  login(credentails: SigninRequest): Observable<SigninResponse> {
    return this.httpClient.post<SigninResponse>(`${this.baseUrl}/users/signin`, credentails).pipe(
      tap((response) => {
        this.cookieService.set(this.TOKEN_COOKIE_NAME, response.token);
      }),
    );
  }
  logout(): void {
    this.cookieService.delete(this.TOKEN_COOKIE_NAME);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    const token = this.cookieService.get(this.TOKEN_COOKIE_NAME);

    if (!token || this.isTokenExpired(token)) {
      this.cookieService.delete(this.TOKEN_COOKIE_NAME);
      return '';
    }

    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return false;
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
      const decodedPayload = atob(normalizedPayload + padding);
      const parsedPayload = JSON.parse(decodedPayload) as { exp?: number };

      if (typeof parsedPayload.exp !== 'number') {
        return false;
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      return parsedPayload.exp <= currentTimeInSeconds;
    } catch {
      return false;
    }
  }
}
