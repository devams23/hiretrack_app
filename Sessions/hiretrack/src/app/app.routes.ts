import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { pendingChangesGuard } from './core/guards/pending-changes-guard';

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
    path: '', 
    loadComponent: () => import('./shared/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    canDeactivate:[pendingChangesGuard],

    children: [
      {
        path: 'boards',
        loadComponent: () =>
          import('./features/boards/boards-list/boards-list').then((m) => m.BoardsList),
      },
      {
        path: 'boards/:board_id',
        loadComponent: () =>
          import('./features/kanban-board-details/board-view/board-view').then((m) => m.BoardView),
      },
      {
        path: 'boards/:board_id/jobs/:job_id',
        loadComponent: () =>
          import('./features/job-application/job-detail/job-detail').then((m) => m.JobDetail),
      },
    ],
  },
];
