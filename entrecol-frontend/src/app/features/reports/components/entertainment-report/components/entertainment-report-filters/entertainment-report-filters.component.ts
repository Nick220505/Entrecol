import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { EntertainmentReportService } from '../../services/entertainment-report.service';

@Component({
  selector: 'app-entertainment-report-filters',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './entertainment-report-filters.component.html',
  styleUrl: './entertainment-report-filters.component.scss',
})
export class EntertainmentReportFiltersComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly form = this.formBuilder.group({
    startDate: [
      this.entertainmentReportService.startDate(),
      Validators.required,
    ],
    endDate: [this.entertainmentReportService.endDate(), Validators.required],
    topN: [
      this.entertainmentReportService.topN(),
      [Validators.required, Validators.min(1)],
    ],
    genreCount: [
      this.entertainmentReportService.genreCount(),
      [Validators.required, Validators.min(1)],
    ],
    moviesByGenreAscending: [
      this.entertainmentReportService.moviesByGenreAscending(),
    ],
    topRatedBooksAscending: [
      this.entertainmentReportService.topRatedBooksAscending(),
    ],
    topBottomBooksByYearAscending: [
      this.entertainmentReportService.topBottomBooksByYearAscending(),
    ],
    moviesByGenreCountAscending: [
      this.entertainmentReportService.moviesByGenreCountAscending(),
    ],
  });

  ngOnInit(): void {
    this.form
      .get('startDate')
      ?.valueChanges.subscribe(this.entertainmentReportService.startDate.set);

    this.form
      .get('endDate')
      ?.valueChanges.subscribe(this.entertainmentReportService.endDate.set);

    this.form.get('topN')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.entertainmentReportService.topN.set(value);
      }
    });

    this.form.get('genreCount')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.entertainmentReportService.genreCount.set(value);
      }
    });

    this.form.get('moviesByGenreAscending')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.entertainmentReportService.moviesByGenreAscending.set(value);
      }
    });

    this.form.get('topRatedBooksAscending')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.entertainmentReportService.topRatedBooksAscending.set(value);
      }
    });

    this.form
      .get('topBottomBooksByYearAscending')
      ?.valueChanges.subscribe((value) => {
        if (value !== null) {
          this.entertainmentReportService.topBottomBooksByYearAscending.set(
            value,
          );
        }
      });

    this.form
      .get('moviesByGenreCountAscending')
      ?.valueChanges.subscribe((value) => {
        if (value !== null) {
          this.entertainmentReportService.moviesByGenreCountAscending.set(
            value,
          );
        }
      });
  }
}
