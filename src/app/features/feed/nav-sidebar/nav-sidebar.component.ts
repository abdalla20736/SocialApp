import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../core/models/auth/user.model';

@Component({
  selector: 'app-nav-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.css',
})
export class NavSidebarComponent {
  private authService = inject(AuthService);

  user: User = this.authService.getCurrentUser();

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
