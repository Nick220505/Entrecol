import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { redirectLoggedInGuard } from '@core/auth/guards/redirect-logged-in.guard';

export const routes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./core/auth/auth.component').then((m) => m.AuthComponent),
    canActivate: [redirectLoggedInGuard],
    title: 'ENTRECOL - Iniciar Sesión',
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./core/auth/auth.component').then((m) => m.AuthComponent),
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
        path: 'empleados',
        loadComponent: () =>
          import('./features/employees/employees.component').then(
            (m) => m.EmployeesComponent,
          ),
        title: 'ENTRECOL - Empleados',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent,
          ),
        title: 'ENTRECOL - Reportes',
      },
      {
        path: '',
        redirectTo: 'libros',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '/iniciar-sesion' },
];
