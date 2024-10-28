import { Author } from './author.model';
import { Language } from './language.model';
import { Publisher } from './publisher.model';
import { Rating } from './rating.model';

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
