import { Component } from '@angular/core';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookUploadComponent, BookListComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {}
