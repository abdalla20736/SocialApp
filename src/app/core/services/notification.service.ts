import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getNotifications(isRead: boolean): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/notifications?unread=${!isRead}&page=1&limit=10`);
  }
}
