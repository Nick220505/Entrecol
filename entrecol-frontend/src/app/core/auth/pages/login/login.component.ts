import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { RecaptchaModule } from 'ng-recaptcha';
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly authService = inject(AuthService);
  protected readonly isPasswordHidden = signal(true);
  protected readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private captchaResponse: string | null = null;

  constructor() {
    effect(() => {
      if (this.authService.isCredentialsInvalid()) {
        this.loginForm.setErrors({ invalidCredentials: true });
      }
    });
  }

  resolvedCaptcha(captchaResponse: string | null): void {
    this.captchaResponse = captchaResponse;
  }

  onSubmit(): void {
    if (!this.captchaResponse) {
      return;
    }

    const { username, password } = this.loginForm.value;
    if (username && password) {
      this.authService.login({
        username,
        password,
        captchaResponse: this.captchaResponse,
      });
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordHidden.update((value) => !value);
    event.stopPropagation();
  }
}
