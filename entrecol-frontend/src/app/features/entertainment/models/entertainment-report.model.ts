import { Book } from '@books/models/book.model';
import { Movie } from '@movies/models/movie.model';

export interface EntertainmentReport {
  moviesByGenre: Movie[];
  topRatedBooks: Book[];
  topAndBottomBooksByYear: Record<number, Book[]>;
  moviesGroupedByGenreCount: Record<number, Movie[]>;
  totalMovies: number;
  moviesByGenreStats: Record<string, number>;
  bookPublicationStats: Record<number, number>;
}
