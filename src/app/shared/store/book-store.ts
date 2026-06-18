import { computed } from '@angular/core';
import { EOrder } from '../entities/enums';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
  withComputed,
} from '@ngrx/signals';
import { BookStoreState } from '../entities/types';
import { INITIAL_BOOKS } from '../entities/books.mock';
import { IBook } from '../entities/interfaces';

const initialState: BookStoreState = {
  books: INITIAL_BOOKS,
  filter: { query: '', authorOrder: EOrder.Asc, titleOrder: EOrder.Asc },
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredBooks: computed(() => sortBooks(store.books(), store.filter())),
  })),
  withMethods((store) => ({
    _load() {
      const storedState = localStorage.getItem('bookStoreState');

      if (storedState) {
        const parsedState: BookStoreState = JSON.parse(storedState);
        patchState(store, parsedState);
      } else {
        this._save();
      }
    },
    _save() {
      localStorage.setItem(
        'bookStoreState',
        JSON.stringify({ books: store.books(), filter: store.filter() }),
      );
    },
    search(query: string) {
      patchState(store, {
        filter: {
          ...store.filter(),
          query,
        },
      });
      this._save();
    },
    sortAuthor(order: EOrder) {
      patchState(store, {
        filter: {
          ...store.filter(),
          authorOrder: order,
        },
      });
      this._save();
    },
    sortTitle(order: EOrder) {
      patchState(store, {
        filter: {
          ...store.filter(),
          titleOrder: order,
        },
      });
      this._save();
    },
    editBook(book: IBook) {
      patchState(store, {
        books: store.books().map((b) => (b.id === book.id ? book : b)),
      });
      this._save();
    },
    removeBook(book: IBook) {
      patchState(store, {
        books: store.books().filter((b) => b.id !== book.id),
      });
      this._save();
    },
    addBook(book: IBook) {
      this.addBooks([book]);
    },
    addBooks(books: BookStoreState['books']) {
      if (!books.length) {
        return;
      }

      patchState(store, {
        books: [...store.books(), ...books],
      });
      this._save();
    },
  })),
  withHooks((store) => ({
    onInit() {
      store._load();
    },
  })),
);

const sortBooks = (books: IBook[], filter: BookStoreState['filter']) => {
  const normalizedQuery = filter.query.toLowerCase();

  return [...books]
    .filter((book) => {
      if (!normalizedQuery) {
        return true;
      }

      return book.title.toLowerCase().includes(normalizedQuery);
    })
    .sort((a, b) => {
      const authorComparison = a.author.localeCompare(b.author);
      if (authorComparison !== 0) {
        return filter.authorOrder === EOrder.Asc ? authorComparison : -authorComparison;
      }

      const titleComparison = a.title.localeCompare(b.title);
      return filter.titleOrder === EOrder.Asc ? titleComparison : -titleComparison;
    });
};
