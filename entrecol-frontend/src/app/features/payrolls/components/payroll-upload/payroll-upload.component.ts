import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '@core/services/snack-bar.service';
import { PayrollService } from '@app/features/payrolls/services/payroll.service';

@Component({
  selector: 'app-payroll-upload',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './payroll-upload.component.html',
  styleUrl: './payroll-upload.component.scss',
})
export class PayrollUploadComponent {
  private readonly snackBar = inject(SnackBarService);
  protected readonly payrollsService = inject(PayrollService);
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
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    if (!validTypes.includes(file.type)) {
      this.snackBar.error('Solo se permiten archivos Excel (.xlsx)');
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
    this.payrollsService.uploadEmployeeFile(this.selectedFile);
  }
}
