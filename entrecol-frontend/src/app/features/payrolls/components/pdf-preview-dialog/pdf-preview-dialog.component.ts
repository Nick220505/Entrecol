import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  NgxExtendedPdfViewerModule,
  pdfDefaultOptions,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
  ],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.scss'],
})
export class PdfPreviewDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PdfPreviewDialogComponent>);

  readonly pdfUrl = signal<string>('');

  constructor() {
    pdfDefaultOptions.assetsFolder = 'assets';
    pdfDefaultOptions.doubleTapZoomFactor = '150%';
  }

  close(): void {
    this.dialogRef.close();
  }
}
