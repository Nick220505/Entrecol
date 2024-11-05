import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EntertainmentReportService } from '../../../services/entertainment-report.service';

@Component({
  selector: 'app-entertainment-report-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './entertainment-report-filters.component.html',
  styleUrl: './entertainment-report-filters.component.scss',
})
export class EntertainmentReportFiltersComponent {
  protected readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  onSubmit(): void {
    if (this.isValid()) {
      this.entertainmentReportService.getReport();
    }
  }

  onExportPdf(): void {
    if (this.isValid()) {
      this.entertainmentReportService.exportToPdf();
    }
  }

  isValid(): boolean {
    return (
      !!this.entertainmentReportService.startDate() &&
      !!this.entertainmentReportService.endDate() &&
      this.entertainmentReportService.topN() > 0 &&
      this.entertainmentReportService.genreCount() > 0
    );
  }
}
