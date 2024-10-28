import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '@core/services/snack-bar.service';
import { MovieService } from '@app/features/movies/services/movie.service';

@Component({
  selector: 'app-movie-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './movie-upload.component.html',
  styleUrl: './movie-upload.component.scss',
})
export class MovieUploadComponent {
  private readonly snackBar = inject(SnackBarService);
  protected readonly moviesService = inject(MovieService);
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
    if (!file.name.endsWith('.dat')) {
      this.snackBar.error('Solo se permiten archivos .dat');
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
        const movies = this.parseMovieData(content);
        this.moviesService.uploadMovies(movies);
      } catch (error) {
        this.snackBar.error('Error al procesar el archivo');
      }
    };

    reader.onerror = () => {
      this.snackBar.error('Error al leer el archivo');
    };

    reader.readAsText(this.selectedFile);
  }

  private parseMovieData(content: string): any[] {
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const [id, title, genresStr] = line.split('::');
        const genres = genresStr.split('|').map((name) => ({ name }));
        const yearMatch = title.match(/\((\d{4})\)/);
        const year = yearMatch ? parseInt(yearMatch[1]) : null;
        const cleanTitle = title.replace(/\(\d{4}\)/, '').trim();

        return {
          originalId: parseInt(id),
          title: cleanTitle,
          releaseYear: year,
          genres,
        };
      });
  }
}
