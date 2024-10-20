import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  readonly isDarkTheme = signal(this.shouldUseDarkTheme());

  constructor() {
    effect(() => {
      if (this.isDarkTheme()) {
        this.document.body.classList.add('dark-theme');
      } else {
        this.document.body.classList.remove('dark-theme');
      }
    });

    // Check and update theme every hour
    setInterval(() => this.checkAndUpdateTheme(), 3600000);
  }

  toggleTheme(): void {
    this.isDarkTheme.update((current) => !current);
  }

  private shouldUseDarkTheme(): boolean {
    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour >= 18; // Dark theme from 6 PM to 6 AM
  }

  private checkAndUpdateTheme(): void {
    const shouldBeDark = this.shouldUseDarkTheme();
    if (shouldBeDark !== this.isDarkTheme()) {
      this.isDarkTheme.set(shouldBeDark);
    }
  }
}
