import { Component } from '@angular/core';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { BookFileUploadComponent } from './components/book-file-upload/book-file-upload.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { LanguageListComponent } from './components/language-list/language-list.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    BookFileUploadComponent,
    BookListComponent,
    LanguageListComponent,
    AuthorListComponent,
    PublisherListComponent,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {}
