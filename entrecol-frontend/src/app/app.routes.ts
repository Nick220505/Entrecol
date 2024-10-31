import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { redirectLoggedInGuard } from '@core/auth/guards/redirect-logged-in.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [redirectLoggedInGuard],
    title: 'ENTRECOL - Iniciar Sesión',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent,
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
          import('./features/books/books.component').then(
            (m) => m.BooksComponent,
          ),
        title: 'ENTRECOL - Libros',
      },
      {
        path: 'peliculas',
        loadComponent: () =>
          import('./features/movies/movies.component').then(
            (m) => m.MoviesComponent,
          ),
        title: 'ENTRECOL - Películas',
      },
      {
        path: 'nominas',
        loadComponent: () =>
          import('./features/payrolls/payrolls.component').then(
            (m) => m.PayrollsComponent,
          ),
        title: 'ENTRECOL - Nóminas',
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
