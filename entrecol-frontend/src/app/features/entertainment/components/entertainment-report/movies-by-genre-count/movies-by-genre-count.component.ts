import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Movie } from '@movies/models/movie.model';

@Component({
  selector: 'app-movies-by-genre-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-by-genre-count.component.html',
  styleUrl: './movies-by-genre-count.component.scss',
})
export class MoviesByGenreCountComponent {
  movies = input.required<Movie[]>();
  genreCount = input.required<number>();
  totalMovies = input.required<number>();
}
