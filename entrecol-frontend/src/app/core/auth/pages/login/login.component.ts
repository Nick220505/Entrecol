import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { LoginCredentials } from '@core/auth/models/login-credentials.model';
import { ThemeService } from '@core/services/theme.service';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly isPasswordHidden = signal(true);
  protected readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    captchaResponse: [null, Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.authService.isLoginInvalid()) {
        this.loginForm.get('captchaResponse')?.reset();
        this.loginForm.setErrors({ invalidCredentials: true });
      }
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value as LoginCredentials);
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordHidden.update((value) => !value);
    event.stopPropagation();
  }
}
