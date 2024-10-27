import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { BookUploadComponent } from '../../components/book-upload/book-upload.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    DatePipe,
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
    EmptyPipe,
    BookUploadComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  protected readonly booksService = inject(BooksService);
  protected readonly books = computed(() => this.booksService.books());
  protected readonly dataSource = computed(() => {
    const data = this.booksService.books().data;
    const source = new MatTableDataSource<Book>(data);
    source.paginator = this.paginator() ?? null;
    source.sort = this.sort() ?? null;
    return source;
  });
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);

  ngOnInit(): void {
    this.booksService.getAll();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator?.firstPage();
  }

  getAuthorsNames(book: Book): string {
    return book.authors?.map((a) => a.name).join(', ') ?? '';
  }
}
