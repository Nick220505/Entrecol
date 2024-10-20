import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';

import { finalize } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { LoginCredentials } from '../models/login-credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isCredentialsInvalid = computed(
    () => this.error() === 'El usuario o la contraseña son incorrectos.'
  );
  readonly isAuthenticated = computed(() => !!localStorage.getItem('token'));

  login(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.snackBarService.success('Inicio de sesión exitoso');
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.error.set('El usuario o la contraseña son incorrectos.');
          } else if (error.status === 0) {
            this.error.set(
              'No se pudo conectar al servidor. Verifique su conexión a internet.'
            );
          } else {
            this.error.set(
              'Ocurrió un error inesperado. Intente nuevamente más tarde.'
            );
          }
        },
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.snackBarService.info('Se ha cerrado la sesión exitosamente');
  }
}
