import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

interface PensionFund {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class PensionFundService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly baseUrl = `${environment.apiUrl}/pension-funds`;

  readonly pensionFunds = signal<{
    data: PensionFund[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  getAll(): void {
    this.pensionFunds.update((state) => ({ ...state, loading: true }));
    this.http.get<PensionFund[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.pensionFunds.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.pensionFunds.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar los fondos de pensión', 'Cerrar');
      },
    });
  }
}
