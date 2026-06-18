import { EOrder } from '../entities/enums';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
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
  withMethods((store) => ({
    _load() {
      const storedState = localStorage.getItem('bookStoreState');

      if (storedState) {
        const parsedState: BookStoreState = JSON.parse(storedState);
        patchState(store, parsedState);
      } else {
        patchState(store, {
          books: this._sortBooks(EOrder.Asc, EOrder.Asc),
          filter: {
            ...store.filter(),
            authorOrder: EOrder.Asc,
            titleOrder: EOrder.Asc,
          },
        });
        this._save();
      }
    },
    _save() {
      localStorage.setItem(
        'bookStoreState',
        JSON.stringify({ books: store.books(), filter: store.filter() }),
      );
    },
    _sortBooks(authorOrder?: EOrder, titleOrder?: EOrder) {
      if (!authorOrder) {
        authorOrder = store.filter().authorOrder;
      }

      if (!titleOrder) {
        titleOrder = store.filter().titleOrder;
      }

      return [...store.books()].sort((a, b) => {
        const authorComparison = a.author.localeCompare(b.author);
        if (authorComparison !== 0) {
          return authorOrder === EOrder.Asc ? authorComparison : -authorComparison;
        }
        const titleComparison = a.title.localeCompare(b.title);
        return titleOrder === EOrder.Asc ? titleComparison : -titleComparison;
      });
    },
    search(query: string) {
      patchState(store, {
        books: store
          .books()
          .filter((book) => book.title.toLowerCase().includes(query.toLowerCase())),
        filter: {
          ...store.filter(),
          query,
        },
      });

      this._save();
    },
    sortAuthor(order: EOrder) {
      patchState(store, {
        books: this._sortBooks(order, store.filter().titleOrder),
        filter: {
          ...store.filter(),
          authorOrder: order,
        },
      });

      this._save();
    },
    sortTitle(order: EOrder) {
      patchState(store, {
        books: this._sortBooks(store.filter().authorOrder, order),
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

      this.sortAuthor(store.filter().authorOrder);
    },
  })),
  withHooks((store) => ({
    onInit() {
      store._load();
    },
  })),
);
