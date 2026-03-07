import { APP_TITLE_SUFFIX } from './core/constants/app.constant';
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
        title: `Home Feed ${APP_TITLE_SUFFIX}`,

        loadComponent: () => import('./features/feed/feed/feed.component').then((m) => m.Feed),
      },
      {
        path: 'suggestions',
        title: `Suggestions ${APP_TITLE_SUFFIX}`,
        loadComponent: () =>
          import('./features/feed/suggestion/suggestion.component').then((m) => m.Suggestions),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./features/view-post-details/view-post-details.component').then(
            (m) => m.ViewPostDetails,
          ),
      },
      {
        path: 'profile',
        title: `Profile ${APP_TITLE_SUFFIX}`,
        loadComponent: () =>
          import('./features/profile/profile/profile.component').then((m) => m.ProfileUser),
      },
      {
        path: 'profile/:id',
        title: `Profile ${APP_TITLE_SUFFIX}`,
        loadComponent: () =>
          import('./features/profile/profile/profile.component').then((m) => m.ProfileUser),
      },
      {
        path: 'notifications',
        title: `Notifications ${APP_TITLE_SUFFIX}`,
        loadComponent: () =>
          import('./features/notifications/notifications/notifications.component').then(
            (m) => m.Notifications,
          ),
      },
      {
        path: 'settings',
        title: `Change Password ${APP_TITLE_SUFFIX}`,
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
        title: `Create Account ${APP_TITLE_SUFFIX}`,
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then((m) => m.Signup),
      },
      {
        title: `Sign In ${APP_TITLE_SUFFIX}`,
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
