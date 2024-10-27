export interface Book {
  id: number;
  originalId: number;
  title: string;
  language: Language;
  numPages: number;
  averageRating: number;
  isbn: string;
  isbn13: string;
  publisher: Publisher;
  publicationDate: Date;
  authors: Author[];
  rating: Rating;
}

export interface Language {
  id: number;
  code: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Rating {
  id: number;
  ratingsCount: number;
  textReviewsCount: number;
}
