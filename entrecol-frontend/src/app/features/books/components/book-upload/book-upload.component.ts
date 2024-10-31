import { Component, inject } from '@angular/core';
import { BookService } from '@books/services/book.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-book-upload',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './book-upload.component.html',
  styleUrl: './book-upload.component.scss',
})
export class BookUploadComponent {
  protected readonly bookService = inject(BookService);
}
