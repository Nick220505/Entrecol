import { Component, OnInit, computed, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Language } from '@books/models/language.model';
import { LanguageService } from '@books/services/language.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { LanguageDialogComponent } from '../language-dialog/language-dialog.component';

@Component({
    selector: 'app-language-list',
    imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        LoadingSpinnerComponent,
        MatDialogModule,
    ],
    templateUrl: './language-list.component.html',
    styleUrl: './language-list.component.scss'
})
export class LanguageListComponent implements OnInit {
  protected readonly languageService = inject(LanguageService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Language>(this.languageService.languages().data),
      {
        paginator: this.paginator(),
        sort: this.sort(),
      },
    ),
  );
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.languageService.getAll();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(LanguageDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.languageService.getAll();
      }
    });
  }

  protected openEditDialog(language: Language): void {
    const dialogRef = this.dialog.open(LanguageDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: language,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.languageService.getAll();
      }
    });
  }

  protected deleteLanguage(language: Language): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Idioma',
        message: `¿Estás seguro de que deseas eliminar el idioma "${language.code}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.languageService.delete(language.id);
      }
    });
  }

  protected applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }
}
