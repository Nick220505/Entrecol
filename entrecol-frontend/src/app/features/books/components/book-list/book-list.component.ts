import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
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
import { Book } from '@books/models/book.model';
import { BookService } from '@books/services/book.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';

@Component({
    selector: 'app-book-list',
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
        DatePipe,
        DecimalPipe,
        LoadingSpinnerComponent,
        EmptyPipe,
        MatDialogModule,
    ],
    templateUrl: './book-list.component.html',
    styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  protected readonly bookService = inject(BookService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(new MatTableDataSource<Book>(this.bookService.books().data), {
      paginator: this.paginator(),
      sort: this.sort(),
    }),
  );
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.bookService.getAll();
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }

  getAuthorsNames(book: Book): string {
    return book.authors.map((a) => a.name).join(', ');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'book-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.getAll();
      }
    });
  }

  protected openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.getAll();
      }
    });
  }

  protected deleteBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Libro',
        message: `¿Estás seguro de que deseas eliminar el libro "${book.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.delete(book.id);
      }
    });
  }
}
