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
import { Author } from '@books/models/author.model';
import { AuthorService } from '@books/services/author.service';

@Component({
    selector: 'app-author-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './author-dialog.component.html',
    styleUrl: './author-dialog.component.scss'
})
export class AuthorDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AuthorDialogComponent>);
  protected readonly authorService = inject(AuthorService);
  protected readonly data = inject<Author | undefined>(MAT_DIALOG_DATA);

  protected readonly form: FormGroup = this.fb.group({
    name: [this.data?.name ?? '', [Validators.required]],
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      if (this.data) {
        this.authorService.update(this.data.id, this.form.value);
      } else {
        this.authorService.create(this.form.value);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
