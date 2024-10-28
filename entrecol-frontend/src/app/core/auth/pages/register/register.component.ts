import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RegisterCredentials } from '@core/auth/models/register-credentials.model';
import { ThemeService } from '@core/services/theme.service';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly isPasswordHidden = signal(true);
  protected readonly registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captchaResponse: [null, Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.authService.isRegisterInvalid()) {
        this.registerForm.get('captchaResponse')?.reset();
        this.registerForm.setErrors({ invalidCredentials: true });
      }
    });
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value as RegisterCredentials);
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordHidden.update((value) => !value);
    event.stopPropagation();
  }
}
