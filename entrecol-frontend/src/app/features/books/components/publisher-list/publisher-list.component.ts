import { Component, OnInit, computed, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Publisher } from '@books/models/publisher.model';
import { PublisherService } from '@books/services/publisher.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PublisherDialogComponent } from '../publisher-dialog/publisher-dialog.component';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    MatDialogModule,
  ],
  templateUrl: './publisher-list.component.html',
  styleUrl: './publisher-list.component.scss',
})
export class PublisherListComponent implements OnInit {
  protected readonly publisherService = inject(PublisherService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Publisher>(
        this.publisherService.publishers().data,
      ),
      {
        paginator: this.paginator(),
        sort: this.sort(),
      },
    ),
  );
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.publisherService.getAll();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(PublisherDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.publisherService.getAll();
      }
    });
  }

  protected openEditDialog(publisher: Publisher): void {
    const dialogRef = this.dialog.open(PublisherDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: publisher,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.publisherService.getAll();
      }
    });
  }

  protected deletePublisher(publisher: Publisher): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Editorial',
        message: `¿Estás seguro de que deseas eliminar la editorial "${publisher.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.publisherService.delete(publisher.id);
      }
    });
  }

  protected applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }
}
