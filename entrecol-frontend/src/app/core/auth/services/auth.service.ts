import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';

import { AuthResponse } from '../models/auth-response.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isCredentialsInvalid = computed(
    () => this.error() === 'El usuario o la contraseña son incorrectos.',
  );
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.http
      .post<AuthResponse>(`${this.apiUrl}/authenticate`, credentials)
      .subscribe({
        next: (response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
          this.isLoading.set(false);
          this.snackBarService.success('Inicio de sesión exitoso');
          this.router.navigate(['/contratos']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (error.status === 401) {
            this.error.set('El usuario o la contraseña son incorrectos.');
          } else if (error.status === 0) {
            this.error.set(
              'No se pudo conectar al servidor. Verifique su conexión a internet.',
            );
          } else {
            this.error.set(
              'Ocurrió un error inesperado. Intente nuevamente más tarde.',
            );
          }
        },
      });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
    this.snackBarService.info('Se ha cerrado la sesión exitosamente');
  }
}
