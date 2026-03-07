import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationCard } from '../components/notification-card/notification-card.component';
import { Notification } from '../../../core/models/notifications/notification.model';
import { CommonModule } from '@angular/common';
import { NotificationSkeleton } from '../components/notification-skeleton/notification-skeleton.component';

@Component({
  selector: 'app-notifications',
  imports: [NotificationCard, CommonModule, NotificationSkeleton],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class Notifications {
  private notificationService = inject(NotificationService);

  notifications: Notification[] = [];
  unreadCount: number = 0;
  selectedFilter: 'all' | 'unread' = 'all';
  apiError: boolean = false;
  isLoading: boolean = false;

  get filteredNotifications(): Notification[] {
    if (this.selectedFilter === 'unread') {
      return this.notifications.filter((notification) => !notification.isRead);
    }
    return this.notifications;
  }

  get emptyMessage(): string {
    return this.selectedFilter === 'unread'
      ? 'No unread notifications yet.'
      : 'No notifications yet.';
  }

  get isUnreadNotificationsEmpty(): boolean {
    return this.unreadCount <= 0;
  }

  ngOnInit(): void {
    this.notifications = this.notificationService.notifications;

    if (this.notifications.length <= 0) {
      this.loadNotifications();
      this.loadUnreadCount();
    }
  }

  setFilter(filter: 'all' | 'unread'): void {
    this.selectedFilter = filter;
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadNotificationsCount().subscribe((count) => {
      this.unreadCount = count;
    });
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications(false, 50).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.notificationService.notifications = notifications;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
        this.apiError = true;
        this.notifications = [];
        this.isLoading = false;
      },
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => (notification.isRead = true));
    this.unreadCount = 0;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {},
      error: (err) => {
        console.error('Failed to mark all notifications as read:', err);
      },
    });
  }
}
