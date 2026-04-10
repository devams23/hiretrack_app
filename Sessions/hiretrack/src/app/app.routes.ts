import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/components/signup-form/signup-form').then((m) => m.SignupForm),
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./features/auth/components/signin-form/signin-form').then((m) => m.SigninForm),
      }
    ],
  },
];
