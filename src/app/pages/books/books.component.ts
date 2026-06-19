import {
  AfterViewInit,
  Component,
  ViewChild,
  inject,
  effect,
  DestroyRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BookStore } from '../../shared/store/book-store';
import { BooksService } from '../../shared/services/books.service';
import { IBook } from '../../shared/entities/interfaces';
import { EOrder } from '../../shared/entities/enums';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  SEARCH_TYPING_DEBOUNCE_MS,
  SNACKBAR_DURATION_AFTER_OPERATION_MS,
} from '../../shared/entities/constants';
import { BookFormDialogComponent } from '../../shared/components/book-form-dialog/book-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-books',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements AfterViewInit {
  private store = inject(BookStore);
  private service = inject(BooksService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  displayedColumns = ['author', 'title', 'pages', 'actions'];

  dataSource = new MatTableDataSource<IBook>([]);
  authorOrder = computed(() => this.store.filter().authorOrder);
  titleOrder = computed(() => this.store.filter().titleOrder);
  searchQuery = computed(() => this.store.filter().query);
  booksCount = computed(() => this.store.filteredBooks().length);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.filteredBooks();
    });

    this.searchSubject
      .pipe(
        debounceTime(SEARCH_TYPING_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.store.search(query);
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  protected exportBooks(): void {
    this.service.exportBooks();
  }

  protected async importBooks(): Promise<void> {
    const result = await this.service.importBooks();

    let message = '';

    if (result.unsupportedBrowser) {
      message = 'Import is not supported by this browser.';
    } else if (result.wrongXmlFileFormat) {
      message = 'XML file format is incorrect.';
    } else if (result.importCanceled) {
      message = 'Import canceled.';
    } else {
      message = `Imported: ${result.importedCount || 0}, Skipped: ${result.skippedCount || 0}`;
    }

    this.snackBar.open(message, 'Close', {
      duration: SNACKBAR_DURATION_AFTER_OPERATION_MS,
      verticalPosition: 'top',
    });
  }

  protected sortAuthor(): void {
    const nextOrder = this.authorOrder() === EOrder.Asc ? EOrder.Desc : EOrder.Asc;
    this.store.sortAuthor(nextOrder);
  }

  protected sortTitle(): void {
    const nextOrder = this.titleOrder() === EOrder.Asc ? EOrder.Desc : EOrder.Asc;
    this.store.sortTitle(nextOrder);
  }

  protected clearSearch(): void {
    this.store.search('');
  }

  protected updateSearch(value: string): void {
    this.searchSubject.next(value);
  }

  protected sortIcon(order: EOrder | null): string {
    return order === EOrder.Asc ? '▲' : '▼';
  }

  protected async addBook(): Promise<void> {
    const ref = this.dialog.open(BookFormDialogComponent, { data: { isEdit: false } });

    const result = await firstValueFrom(ref.afterClosed());

    if (result) {
      this.store.addBook(result);
      this.snackBar.open('Book added', 'Close', {
        duration: SNACKBAR_DURATION_AFTER_OPERATION_MS,
        verticalPosition: 'top',
      });
    }
  }

  protected async editBook(book: IBook): Promise<void> {
    const ref = this.dialog.open(BookFormDialogComponent, { data: { book, isEdit: true } });

    const result = await firstValueFrom(ref.afterClosed());

    if (result) {
      this.store.editBook(result);

      this.snackBar.open('Book updated', 'Close', {
        duration: SNACKBAR_DURATION_AFTER_OPERATION_MS,
        verticalPosition: 'top',
      });
    }
  }

  protected async confirmDelete(book: IBook): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete "${book.title}"?` },
    });

    const confirmed = await firstValueFrom(ref.afterClosed());

    if (confirmed) {
      this.store.removeBook(book);

      this.snackBar.open('Book deleted', 'Close', {
        duration: SNACKBAR_DURATION_AFTER_OPERATION_MS,
        verticalPosition: 'top',
      });
    }
  }
}
