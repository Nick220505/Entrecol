import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '@movies/models/movie.model';
import { MovieService } from '@movies/services/movie.service';

@Component({
    selector: 'app-movie-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './movie-dialog.component.html',
    styleUrl: './movie-dialog.component.scss'
})
export class MovieDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly movieService = inject(MovieService);
  private readonly dialogRef = inject(MatDialogRef<MovieDialogComponent>);
  protected readonly data: Movie = inject(MAT_DIALOG_DATA);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required]],
    releaseYear: [null as number | null, [Validators.required]],
    genres: [[] as string[], [Validators.required]],
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        releaseYear: this.data.releaseYear,
        genres: this.data.genres.map((g) => g.name),
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const movie: Movie = {
        originalId:
          this.data?.originalId ?? Math.floor(Math.random() * 1000000),
        title: this.form.value.title ?? '',
        releaseYear: this.form.value.releaseYear ?? null,
        genres: this.form.value.genres?.map((name) => ({ name })) ?? [],
      };

      if (this.data?.id) {
        this.movieService.update(this.data.id, movie);
      } else {
        this.movieService.create(movie);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
