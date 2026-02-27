import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FeatureCard } from './feature-card/feature-card.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, FeatureCard],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
})
export class AuthLayout {
  private router = inject(Router);

  get isSignup(): boolean {
    return this.router.url.includes('signup');
  }
}
