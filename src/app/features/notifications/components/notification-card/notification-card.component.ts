import { Component, inject, Input, OnInit } from '@angular/core';
import { Notification } from '../../../../core/models/notifications/notification.model';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-card',
  imports: [CommonModule, TimeagoModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css',
})
export class NotificationCard implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  @Input() notification!: Notification;
  ngOnInit(): void {}

  navigateToPost() {
    if (this.notification.entityType !== 'post') return;

    this.router.navigate(['/post', this.notification.entity._id]);
  }

  markAsRead(event: Event): void {
    event.stopPropagation();
    if (!this.notification.isRead) {
      this.notification.isRead = true;
      this.notificationService.markAsRead(this.notification._id).subscribe({
        next: () => {},
        error: (err) => {
          console.error('Failed to mark notification as read:', err);
        },
      });
    }
  }
}
