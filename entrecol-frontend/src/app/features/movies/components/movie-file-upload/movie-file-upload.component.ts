import { Component, inject } from '@angular/core';
import { MovieService } from '@movies/services/movie.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@Component({
    selector: 'app-movie-file-upload',
    imports: [FileUploadComponent],
    templateUrl: './movie-file-upload.component.html',
    styleUrl: './movie-file-upload.component.scss'
})
export class MovieFileUploadComponent {
  protected readonly movieService = inject(MovieService);
}
