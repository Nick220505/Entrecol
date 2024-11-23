import { Component } from '@angular/core';
import { MovieFileUploadComponent } from './components/movie-file-upload/movie-file-upload.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';

@Component({
    selector: 'app-movies',
    imports: [MovieFileUploadComponent, MovieListComponent],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss'
})
export class MoviesComponent {}
