import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';

import { finalize } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { RegisterCredentials } from '../models/register-credentials.model';
import { User } from '../models/user.model';

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
  readonly isLoginInvalid = signal(false);
  readonly isRegisterInvalid = signal(false);
  readonly isAuthenticated = signal(!!localStorage.getItem('token'));

  register(credentials: RegisterCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.isRegisterInvalid.set(false);
    this.http
      .post<User>(`${this.apiUrl}/register`, credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackBarService.success(
            'Registro exitoso. Por favor inicie sesión.'
          );
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            if (error.error === 'Username is already taken!') {
              this.error.set('El nombre de usuario ya está en uso.');
            } else if (error.error === 'Email is already in use!') {
              this.error.set('El correo electrónico ya está registrado.');
            } else {
              this.error.set(
                'Por favor, complete todos los campos correctamente.'
              );
            }
            this.isRegisterInvalid.set(true);
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

  login(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.isLoginInvalid.set(false);
    this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.isAuthenticated.set(true);
          this.snackBarService.success('Inicio de sesión exitoso');
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.error.set('El usuario o la contraseña son incorrectos.');
            this.isLoginInvalid.set(true);
          } else if (error.status === 400) {
            this.error.set('Por favor, complete el captcha correctamente.');
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
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
    this.snackBarService.info('Se ha cerrado la sesión exitosamente');
  }
}
