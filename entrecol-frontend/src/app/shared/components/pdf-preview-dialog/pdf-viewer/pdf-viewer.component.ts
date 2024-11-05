import { Component, input } from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  pdfDefaultOptions,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  readonly src = input.required<string>();
  readonly height = input<string>('80vh');

  constructor() {
    pdfDefaultOptions.assetsFolder = 'assets';
    pdfDefaultOptions.doubleTapZoomFactor = '150%';
  }
}
