import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerComponent } from '@shared/components/pdf-preview-dialog/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    PdfViewerComponent,
  ],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrl: './pdf-preview-dialog.component.scss',
})
export class PdfPreviewDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PdfPreviewDialogComponent>);

  readonly pdfUrl = signal<string>('');

  close(): void {
    this.dialogRef.close();
  }
}
