import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

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
          this.snackBar.open(
            'Registro exitoso. Por favor inicie sesión.',
            'Cerrar',
          );
          this.router.navigate(['/login']);
        },
        error: ({ error, status }: HttpErrorResponse) => {
          if (status === 400) {
            if (error === 'Username is already taken!') {
              this.error.set('El nombre de usuario ya está en uso.');
            } else if (error === 'Email is already in use!') {
              this.error.set('El correo electrónico ya está registrado.');
            } else {
              this.error.set(
                'Por favor, complete todos los campos correctamente.',
              );
            }
            this.isRegisterInvalid.set(true);
          } else if (status === 0) {
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

  login(credentials: LoginCredentials): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.isLoginInvalid.set(false);
    this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ token }) => {
          localStorage.setItem('token', token);
          this.isAuthenticated.set(true);
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar');
          this.router.navigate(['/']);
        },
        error: ({ status }: HttpErrorResponse) => {
          if (status === 401) {
            this.error.set('El usuario o la contraseña son incorrectos.');
            this.isLoginInvalid.set(true);
          } else if (status === 400) {
            this.error.set('Por favor, complete el captcha correctamente.');
          } else if (status === 0) {
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
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
    this.snackBar.open('Se ha cerrado la sesión exitosamente', 'Cerrar');
  }
}
