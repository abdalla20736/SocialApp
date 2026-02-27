import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationResponse } from '../models/notifications/notification-response.model';
import { Notification } from '../models/notifications/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  notifications: Notification[] = [];

  getNotifications(
    unRead: boolean,
    limit: number = 10,
    page: number = 1,
  ): Observable<Notification[]> {
    return this.httpClient
      .get<NotificationResponse>(`${this.baseUrl}/notifications`, {
        params: {
          unRead: unRead.toString(),
          limit: limit.toString(),
          page: page.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response.data.notifications;
        }),
      );
  }

  getUnreadNotificationsCount(): Observable<number> {
    return this.httpClient
      .get(`${this.baseUrl}/notifications/unread-count`)
      .pipe(map((response: any) => response.data.unreadCount));
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/notifications/read-all`, {});
  }
}
