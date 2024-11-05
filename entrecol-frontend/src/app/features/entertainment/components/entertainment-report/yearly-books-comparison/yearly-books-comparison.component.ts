import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Book } from '@books/models/book.model';

interface YearlyBookData {
  year: number;
  topBooks: Book[];
  bottomBooks: Book[];
}

@Component({
  selector: 'app-yearly-books-comparison',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './yearly-books-comparison.component.html',
  styleUrl: './yearly-books-comparison.component.scss',
})
export class YearlyBooksComparisonComponent {
  yearlyData = input.required<YearlyBookData[]>();
}
