import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './book-upload.component.html',
  styleUrl: './book-upload.component.scss',
})
export class BookUploadComponent {
  private readonly booksService = inject(BooksService);

  selectedFile: File | null = null;
  uploading = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const books = JSON.parse(content);

        this.booksService.uploadBooks(books);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      } finally {
        this.uploading = false;
      }
    };

    reader.readAsText(this.selectedFile);
  }
}
