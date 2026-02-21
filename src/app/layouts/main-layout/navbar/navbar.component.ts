import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);

  user: User = this.authService.getCurrentUser();

  ngOnInit() {
    initFlowbite();
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
