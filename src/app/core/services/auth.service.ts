import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { SigninRequest, SigninResponse, User } from '../models/user.model';
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

  register(userData: User): Observable<any> {
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
    this.router.navigate(['/signin']);
  }

  getToken(): string {
    return this.cookieService.get(this.TOKEN_COOKIE_NAME);
  }

  isAuthenticated(): boolean {
    return this.cookieService.check(this.TOKEN_COOKIE_NAME);
  }
}
