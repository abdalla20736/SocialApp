import { authGuard } from './core/guards/auth.guard';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then((m) => m.Signup),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/signin/signin.component').then((m) => m.Signin),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/timeline/timeline.component').then((m) => m.Timeline),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFound),
  },
];
