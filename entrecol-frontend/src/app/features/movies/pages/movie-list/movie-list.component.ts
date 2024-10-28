import { CommonModule, DatePipe } from '@angular/common';
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
import { MovieService } from '@app/features/movies/services/movie.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { MovieUploadComponent } from '../../components/movie-upload/movie-upload.component';
import { Movie } from '../../models/movie.model';

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
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
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
    MovieUploadComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit, AfterViewInit {
  protected readonly movieService = inject(MovieService);
  protected readonly movies = computed(() => this.movieService.movies());
  protected readonly dataSource = computed(() => {
    const source = new MatTableDataSource<Movie>(this.movies().data);
    source.paginator = this.paginator() ?? null;
    source.sort = this.sort() ?? null;
    return source;
  });
  protected readonly displayedColumns = ['title', 'releaseYear', 'genres'];
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.movieService.getAll();
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

  getGenreNames(movie: Movie): string {
    return movie.genres?.map((g) => g.name).join(', ') ?? '';
  }

  getYearColor(year: number): string {
    const currentYear = new Date().getFullYear();
    if (year >= currentYear - 1) return 'var(--mat-green-500)';
    if (year >= currentYear - 5) return 'var(--mat-lime-500)';
    if (year >= currentYear - 10) return 'var(--mat-orange-500)';
    return 'var(--mat-red-500)';
  }
}
