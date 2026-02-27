import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed',
      },
      {
        path: 'feed',
        title: 'Home Feed | Social App',

        loadComponent: () => import('./features/feed/feed/feed.component').then((m) => m.Feed),
      },
      {
        path: 'suggestions',
        title: 'Suggestions | Social App',
        loadComponent: () =>
          import('./features/feed/suggestion/suggestion.component').then((m) => m.Suggestions),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./features/feed/view-post-details/view-post-details.component').then(
            (m) => m.ViewPostDetails,
          ),
      },
      {
        path: 'profile',
        title: 'Profile | Social App',
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.Profile),
      },
      {
        path: 'notifications',
        title: 'Notifications | Social App',
        loadComponent: () =>
          import('./features/notifications/notifications/notifications.component').then(
            (m) => m.Notifications,
          ),
      },
      {
        path: 'settings',
        title: 'Change Password | Social App',
        loadComponent: () =>
          import('./features/auth/change-password/change-password.component').then(
            (m) => m.ChangePassword,
          ),
      },
    ],
  },
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayout),
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then((m) => m.Signup),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/signin/signin.component').then((m) => m.Signin),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFound),
  },
];
