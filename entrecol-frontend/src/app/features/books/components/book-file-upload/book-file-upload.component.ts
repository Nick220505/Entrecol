import { Component, inject } from '@angular/core';
import { BookService } from '@books/services/book.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-book-file-upload',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './book-file-upload.component.html',
  styleUrl: './book-file-upload.component.scss',
})
export class BookFileUploadComponent {
  protected readonly bookService = inject(BookService);
}
