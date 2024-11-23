import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Book } from '@books/models/book.model';
import { EntertainmentReportService } from '../../services/entertainment-report.service';

@Component({
    selector: 'app-yearly-books-comparison',
    imports: [DecimalPipe],
    templateUrl: './yearly-books-comparison.component.html',
    styleUrl: './yearly-books-comparison.component.scss'
})
export class YearlyBooksComparisonComponent {
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly yearlyData = computed(() => {
    const booksByYear =
      this.entertainmentReportService.report()?.data?.topAndBottomBooksByYear;
    if (!booksByYear) return [];

    const years = Object.keys(booksByYear).map(Number);
    const isAscending =
      this.entertainmentReportService.topBottomBooksByYearAscending();

    const sortedYears = isAscending
      ? years.sort((a, b) => a - b)
      : years.sort((a, b) => b - a);

    return sortedYears.map((year) => {
      const books = booksByYear[year];
      const midPoint = Math.floor(books.length / 2);
      const topBooks = books.slice(0, midPoint);
      const bottomBooks = books.slice(midPoint);

      const sortBooks = (bookList: Book[]) => {
        return [...bookList].sort((a, b) => {
          const comparison = a.title.localeCompare(b.title);
          return isAscending ? comparison : -comparison;
        });
      };

      return {
        year,
        topBooks: sortBooks(topBooks),
        bottomBooks: sortBooks(bottomBooks),
      };
    });
  });
}
