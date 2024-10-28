import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  Injectable,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookService } from '@app/features/books/services/book.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { BookUploadComponent } from '../../components/book-upload/book-upload.component';
import { Book } from '../../models/book.model';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return 'Página 1 de 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  };
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
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
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit, AfterViewInit {
  protected readonly booksService = inject(BookService);
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

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.booksService.getAll();
  }

  ngAfterViewInit() {
    const card = this.elementRef.nativeElement.querySelector('mat-card');

    if (card) {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator?.firstPage();
  }

  getAuthorsNames(book: Book): string {
    return book.authors?.map((a) => a.name).join(', ');
  }

  getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'var(--mat-green-500)';
    if (rating >= 4) return 'var(--mat-lime-500)';
    if (rating >= 3) return 'var(--mat-orange-500)';
    return 'var(--mat-red-500)';
  }
}
