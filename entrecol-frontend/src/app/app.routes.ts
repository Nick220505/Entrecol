import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { redirectLoggedInGuard } from '@core/auth/guards/redirect-logged-in.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [redirectLoggedInGuard],
    title: 'ENTRECOL - Iniciar Sesión',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [redirectLoggedInGuard],
    title: 'ENTRECOL - Registro',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'libros',
        loadComponent: () =>
          import('./features/books/pages/book-list/book-list.component').then(
            (m) => m.BookListComponent
          ),
        title: 'ENTRECOL - Libros',
      },
      {
        path: '',
        redirectTo: 'libros',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
