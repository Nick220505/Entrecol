import { NgClass } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

interface SnackBarData {
  message: string;
  type: AlertType;
}

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [NgClass, MatButtonModule, MatIconModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SnackBarComponent {
  protected readonly snackBarRef = inject(MatSnackBarRef);
  protected readonly data = inject<SnackBarData>(MAT_SNACK_BAR_DATA);

  close(): void {
    this.snackBarRef.dismiss();
  }
}
