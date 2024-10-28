import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '@core/services/snack-bar.service';
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
    MatTooltipModule,
  ],
  templateUrl: './book-upload.component.html',
  styleUrl: './book-upload.component.scss',
})
export class BookUploadComponent {
  private readonly snackBar = inject(SnackBarService);
  protected readonly booksService = inject(BooksService);
  protected readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  selectedFile: File | null = null;
  isDragging = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type !== 'application/json') {
      this.snackBar.error('Solo se permiten archivos JSON');
      return;
    }

    if (file.size > this.maxFileSize) {
      this.snackBar.error('El archivo no debe superar los 10MB');
      return;
    }

    this.selectedFile = file;
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const books = JSON.parse(content);
        this.booksService.uploadBooks(books);
      } catch (error) {
        this.snackBar.error('El archivo JSON no es válido');
      }
    };

    reader.onerror = () => {
      this.snackBar.error('Error al leer el archivo');
    };

    reader.readAsText(this.selectedFile);
  }
}
