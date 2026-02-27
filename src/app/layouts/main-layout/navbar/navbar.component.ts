import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  user: User = this.authService.getCurrentUser();
  unreadNotificationsCount: number = 0;

  ngOnInit() {
    initFlowbite();
    this.loadUnreadNotificationsCount();
  }
  loadUnreadNotificationsCount() {
    this.notificationService.getUnreadNotificationsCount().subscribe((count) => {
      this.unreadNotificationsCount = count;
    });
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
