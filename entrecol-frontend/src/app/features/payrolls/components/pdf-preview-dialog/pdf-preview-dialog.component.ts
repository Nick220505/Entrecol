import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    PdfViewerComponent,
  ],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.scss'],
})
export class PdfPreviewDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PdfPreviewDialogComponent>);

  readonly pdfUrl = signal<string>('');

  close(): void {
    this.dialogRef.close();
  }
}
