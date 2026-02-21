import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getProfile(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/users/profile`).pipe(tap((response) => {}));
  }

  updateProfilePhoto(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image, image.name);
    return this.httpClient.put(`${this.baseUrl}/users/upload-photo`, formData);
  }
}
