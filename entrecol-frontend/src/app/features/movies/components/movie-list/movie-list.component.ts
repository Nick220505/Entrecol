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
import { Movie } from '@movies/models/movie.model';
import { MovieService } from '@movies/services/movie.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

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
    EmptyPipe,
    MatDialogModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit {
  protected readonly movieService = inject(MovieService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Movie>(this.movieService.movies().data),
      {
        paginator: this.paginator(),
        sort: this.sort(),
      },
    ),
  );
  private readonly dialog = inject(MatDialog);

  protected readonly displayedColumns = [
    'title',
    'releaseYear',
    'genres',
    'actions',
  ];

  ngOnInit(): void {
    this.movieService.getAll();
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }

  getGenreNames(movie: Movie): string {
    return movie.genres.map((g) => g.name).join(', ');
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.movieService.getAll();
      }
    });
  }

  protected openEditDialog(movie: Movie): void {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: movie,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.movieService.getAll();
      }
    });
  }

  protected deleteMovie(movie: Movie): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Película',
        message: `¿Estás seguro de que deseas eliminar la película "${movie.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.movieService.delete(movie.id!);
      }
    });
  }
}
