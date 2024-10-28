import { Genre } from './genre.model';

export interface Movie {
  id?: number;
  originalId: number;
  title: string;
  releaseYear: number | null;
  genres: Genre[];
}
