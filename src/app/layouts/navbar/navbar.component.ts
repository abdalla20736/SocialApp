import { UserService } from './../../core/services/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userProfile: UserProfile = this.userService.getCurrentUser() as UserProfile;

  ngOnInit() {
    initFlowbite();
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
