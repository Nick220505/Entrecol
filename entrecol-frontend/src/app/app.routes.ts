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
        path: 'nominas',
        loadComponent: () =>
          import('./features/payrolls/payrolls.component').then(
            (m) => m.PayrollsComponent,
          ),
        title: 'ENTRECOL - Nóminas',
      },
      {
        path: 'reportes',
        children: [
          {
            path: 'entretenimiento',
            loadComponent: () =>
              import(
                './features/entertainment/components/entertainment-report/entertainment-report.component'
              ).then((m) => m.EntertainmentReportComponent),
            title: 'ENTRECOL - Reporte de Entretenimiento',
          },
        ],
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
