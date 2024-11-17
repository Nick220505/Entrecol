import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Language } from '@books/models/language.model';
import { LanguageService } from '@books/services/language.service';

@Component({
  selector: 'app-language-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './language-dialog.component.html',
  styleUrl: './language-dialog.component.scss',
})
export class LanguageDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LanguageDialogComponent>);
  protected readonly languageService = inject(LanguageService);
  protected readonly data = inject<Language | undefined>(MAT_DIALOG_DATA);

  protected readonly form: FormGroup = this.fb.group({
    code: [this.data?.code ?? '', [Validators.required]],
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      if (this.data) {
        this.languageService.update(this.data.id, this.form.value);
      } else {
        this.languageService.create(this.form.value);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
