import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models/user-profile.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.css',
})
export class NavSidebarComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userProfile: UserProfile = this.userService.getCurrentUser() as UserProfile;

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
