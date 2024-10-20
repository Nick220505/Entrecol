import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType,
  SnackBarComponent,
} from '@shared/components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.showSnackBar(message, 'success');
  }

  error(message: string): void {
    this.showSnackBar(message, 'error');
  }

  info(message: string): void {
    this.showSnackBar(message, 'info');
  }

  warning(message: string): void {
    this.showSnackBar(message, 'warning');
  }

  private showSnackBar(message: string, type: AlertType): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, type },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'],
    });
  }
}
