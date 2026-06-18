import { AfterViewInit, Component, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BookStore } from '../../shared/store/book-store';
import { BooksService } from '../../shared/services/books.service';
import { IBook } from '../../shared/entities/interfaces';
import { EOrder } from '../../shared/entities/enums';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SEARCH_TYPING_DEBOUNCE_MS } from '../../shared/entities/constants';

@Component({
  selector: 'app-books',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements AfterViewInit, OnDestroy {
  private store = inject(BookStore);
  private service = inject(BooksService);

  displayedColumns = ['author', 'title', 'actions'];
  dataSource = new MatTableDataSource<IBook>([]);
  searchQuery = '';
  authorOrder: EOrder | null = null;
  titleOrder: EOrder | null = null;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.filteredBooks();
      const filter = this.store.filter();
      this.authorOrder = filter.authorOrder;
      this.titleOrder = filter.titleOrder;
      this.searchQuery = filter.query;
    });

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(SEARCH_TYPING_DEBOUNCE_MS), distinctUntilChanged())
      .subscribe((query) => {
        this.store.search(query);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  protected exportBooks() {
    this.service.exportBooks();
  }

  protected async importBooks() {
    await this.service.importBooks();
  }

  protected sortAuthor(): void {
    const nextOrder = this.authorOrder === EOrder.Asc ? EOrder.Desc : EOrder.Asc;
    this.store.sortAuthor(nextOrder);
  }

  protected sortTitle(): void {
    const nextOrder = this.titleOrder === EOrder.Asc ? EOrder.Desc : EOrder.Asc;
    this.store.sortTitle(nextOrder);
  }

  protected clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  protected updateSearch(value: string): void {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  protected sortIcon(order: EOrder | null): string {
    if (order === EOrder.Asc) {
      return '▲';
    }
    if (order === EOrder.Desc) {
      return '▼';
    }
    return '';
  }
}
