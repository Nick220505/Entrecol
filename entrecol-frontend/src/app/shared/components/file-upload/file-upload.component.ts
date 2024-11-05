import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly maxFileSize = 10 * 1024 * 1024;

  protected readonly isDragging = signal(false);
  protected readonly isValid = computed(() => {
    return this.selectedFile() !== null && !this.isUploading();
  });

  readonly title = input('');
  readonly subtitle = input('');
  readonly acceptedFileTypes = input<string[]>([]);
  readonly acceptAttribute = input('');
  readonly uploadButtonText = input('Cargar');
  readonly isUploading = input(false);
  readonly selectedFile = model<File | null>(null);
  readonly fileSelected = output<Event>();
  readonly fileUpload = output<File>();

  onFileSelected(event: Event): void {
    this.fileSelected.emit(event);
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    if (!this.isValidFileType(file)) {
      this.snackBar.open(
        `Solo se permiten archivos: ${this.acceptAttribute()}`,
        'Cerrar',
      );
      return;
    }

    if (file.size > this.maxFileSize) {
      this.snackBar.open('El archivo no debe superar los 10MB', 'Cerrar');
      return;
    }

    this.selectedFile.set(file);
  }

  isValidFileType(file: File): boolean {
    return this.acceptedFileTypes().some(
      (type) => file.type === type || file.name.endsWith(`.${type}`),
    );
  }

  uploadFile(): void {
    const file = this.selectedFile();
    if (file) {
      this.fileUpload.emit(file);
    }
  }

  clearFile(): void {
    this.selectedFile.set(null);
  }
}
