import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { APP_NAME } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  APP_NAME = APP_NAME;
  user: User = this.authService.getCurrentUser();
  unreadNotificationsCount: number = 0;
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit() {
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
