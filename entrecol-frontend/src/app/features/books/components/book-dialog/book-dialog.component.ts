import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Book } from '@books/models/book.model';
import { AuthorService } from '@books/services/author.service';
import { BookService } from '@books/services/book.service';
import { LanguageService } from '@books/services/language.service';
import { PublisherService } from '@books/services/publisher.service';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
})
export class BookDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BookDialogComponent>);
  protected readonly data = inject<Book | undefined>(MAT_DIALOG_DATA);
  protected readonly bookService = inject(BookService);
  protected readonly languageService = inject(LanguageService);
  protected readonly publisherService = inject(PublisherService);
  protected readonly authorService = inject(AuthorService);

  protected readonly form: FormGroup = this.fb.group({
    title: [
      this.data?.title ?? '',
      [Validators.required, Validators.minLength(3)],
    ],
    isbn: [
      this.data?.isbn ?? '',
      [Validators.required, Validators.pattern(/^\d{10}$/)],
    ],
    isbn13: [
      this.data?.isbn13 ?? '',
      [Validators.required, Validators.pattern(/^\d{13}$/)],
    ],
    numPages: [
      this.data?.numPages ?? '',
      [Validators.required, Validators.min(1), Validators.max(10000)],
    ],
    averageRating: [
      this.data?.averageRating ?? '',
      [Validators.required, Validators.min(0), Validators.max(5)],
    ],
    publicationDate: [this.data?.publicationDate ?? '', [Validators.required]],
    languageId: [this.data?.language?.id ?? '', [Validators.required]],
    publisherId: [this.data?.publisher?.id ?? '', [Validators.required]],
    authorIds: [
      this.data?.authors?.map((a) => a.id) ?? [],
      [Validators.required],
    ],
  });

  ngOnInit(): void {
    this.languageService.getAll();
    this.publisherService.getAll();
    this.authorService.getAll();
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      if (this.data) {
        this.bookService.update(this.data.id, this.form.value);
      } else {
        this.bookService.create(this.form.value);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
