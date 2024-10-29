import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
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
import { CustomPaginatorIntl } from '@shared/config/paginator-intl.config';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { MovieUploadComponent } from '../../components/movie-upload/movie-upload.component';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
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
    MovieUploadComponent,
    EmptyPipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit, AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  protected readonly movieService = inject(MovieService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Movie>(this.movieService.movies().data),
      { paginator: this.paginator(), sort: this.sort() },
    ),
  );

  ngOnInit(): void {
    this.movieService.getAll();
  }

  ngAfterViewInit(): void {
    const card = this.elementRef.nativeElement.querySelector('mat-card');

    if (card) {
      card.addEventListener('mousemove', (e: MouseEvent): void => {
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
