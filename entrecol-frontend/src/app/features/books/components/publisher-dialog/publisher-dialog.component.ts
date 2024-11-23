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
import { Publisher } from '@books/models/publisher.model';
import { PublisherService } from '@books/services/publisher.service';

@Component({
    selector: 'app-publisher-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './publisher-dialog.component.html',
    styleUrl: './publisher-dialog.component.scss'
})
export class PublisherDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PublisherDialogComponent>);
  protected readonly publisherService = inject(PublisherService);
  protected readonly data = inject<Publisher | undefined>(MAT_DIALOG_DATA);

  protected readonly form: FormGroup = this.fb.group({
    name: [this.data?.name ?? '', [Validators.required]],
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      if (this.data) {
        this.publisherService.update(this.data.id, this.form.value);
      } else {
        this.publisherService.create(this.form.value);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
