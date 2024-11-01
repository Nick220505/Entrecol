import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { LoginCredentials } from './models/login-credentials.model';
import { RegisterCredentials } from './models/register-credentials.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AlertMessageComponent,
    LoadingSpinnerComponent,
    RecaptchaModule,
    RecaptchaFormsModule,
    RouterLink,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly isPasswordHidden = signal(true);

  protected readonly isRegisterMode = computed(
    () => this.router.url === '/registro',
  );

  protected readonly pageTitle = computed(() =>
    this.isRegisterMode() ? 'Registro de Usuario' : 'Inicio de Sesión',
  );

  protected readonly bannerTitle = computed(() =>
    this.isRegisterMode() ? 'Únete a EntreCOL+' : 'Bienvenido a EntreCOL+',
  );

  protected readonly authForm = this.formBuilder.group({
    username: [
      '',
      [
        Validators.required,
        ...(this.isRegisterMode() ? [Validators.minLength(3)] : []),
      ],
    ],
    ...(this.isRegisterMode()
      ? {
          email: ['', [Validators.required, Validators.email]],
        }
      : {}),
    password: [
      '',
      [
        Validators.required,
        ...(this.isRegisterMode() ? [Validators.minLength(6)] : []),
      ],
    ],
    captchaResponse: [null, Validators.required],
  });

  constructor() {
    effect(() => {
      if (
        (this.isRegisterMode() && this.authService.isRegisterInvalid()) ||
        (!this.isRegisterMode() && this.authService.isLoginInvalid())
      ) {
        this.authForm.get('captchaResponse')?.reset();
        this.authForm.setErrors({ invalidCredentials: true });
      }
    });
  }

  onSubmit(): void {
    if (this.isRegisterMode()) {
      this.authService.register(this.authForm.value as RegisterCredentials);
    } else {
      this.authService.login(this.authForm.value as LoginCredentials);
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordHidden.update((value) => !value);
    event.stopPropagation();
  }
}
