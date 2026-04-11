import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },
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
      },
    ],
  },
  {
    path: 'boards',
    loadComponent: () =>
      import('./features/boards/boards-list/boards-list').then((m) => m.BoardsList),
    canActivate: [authGuard],
  },
  {
    path: 'boards/create',
    loadComponent: () => import('./features/boards/board-form/board-form').then((m) => m.BoardForm),
    canActivate: [authGuard],
  },
  {
    path: 'boards/:board_id',
    loadComponent: () =>
      import('./features/kanban-board-details/board-view/board-view').then((m) => m.BoardView),
    canActivate: [authGuard],
  },
  {
    path: 'boards/:board_id/jobs/create',
    loadComponent: () =>
      import('./features/job-application/job-form/job-form').then((m) => m.JobForm),
    canActivate: [authGuard],
  }

];
