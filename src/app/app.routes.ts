import { authGuard } from './core/guards/auth.guard';
import { Signin } from './features/auth/signin/signin.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'timeline',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then((m) => m.Signup),
      },
      {
        path: 'signin',
        loadComponent: () => import('./features/auth/signin/signin.component').then((m) => m.Signin),
      },
    ],
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'timeline',
        loadComponent: () => import('./features/timeline/timeline.component').then((m) => m.Timeline),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFound),
  },
];
