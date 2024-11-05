import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Book } from '@books/models/book.model';

@Component({
  selector: 'app-top-rated-books-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './top-rated-books-list.component.html',
  styleUrl: './top-rated-books-list.component.scss',
})
export class TopRatedBooksListComponent {
  books = input.required<Book[]>();
  topN = input.required<number>();
}
