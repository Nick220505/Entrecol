export interface Movie {
  id: number;
  originalId: number;
  title: string;
  releaseYear: number;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}
