import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { EntertainmentReportService } from '../../services/entertainment-report.service';

@Component({
  selector: 'app-top-rated-books-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './top-rated-books-list.component.html',
  styleUrl: './top-rated-books-list.component.scss',
})
export class TopRatedBooksListComponent {
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly topN = this.entertainmentReportService.topN;

  protected readonly books = computed(() => {
    const books = this.entertainmentReportService.report()?.data?.topRatedBooks;
    if (!books) return [];

    return this.entertainmentReportService.topRatedBooksAscending()
      ? [...books].sort((a, b) => a.title.localeCompare(b.title))
      : [...books].sort((a, b) => b.title.localeCompare(a.title));
  });
}
