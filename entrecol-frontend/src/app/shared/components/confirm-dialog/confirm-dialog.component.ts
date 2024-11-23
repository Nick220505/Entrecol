import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
    styles: `
    mat-dialog-content {
      padding: 20px 24px;
      min-width: 300px;

      p {
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      gap: 16px;

      button {
        min-width: 100px;
      }
    }

    :host-context(.dark-theme) {
      mat-dialog-actions {
        border-top-color: rgba(255, 255, 255, 0.12);
      }
    }
  `
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
