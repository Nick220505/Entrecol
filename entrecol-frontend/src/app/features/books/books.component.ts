import { Component } from '@angular/core';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFileUploadComponent } from './components/book-file-upload/book-file-upload.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookFileUploadComponent, BookListComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {}
