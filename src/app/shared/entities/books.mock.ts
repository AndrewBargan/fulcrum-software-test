import { IBook } from './interfaces';

export const INITIAL_BOOKS: IBook[] = [
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Ugly Duckling',
    pages: 100,
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Little Mermaid',
    pages: 132,
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: "The Emperor's New Clothes",
    pages: 324,
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Snow Queen',
    pages: 48,
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Little Match Girl',
    pages: 383,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Shining',
    pages: 23,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'It',
    pages: 930,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Stand',
    pages: 236,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'Carrie',
    pages: 99,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Long Walk',
    pages: 998,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Dead Zone',
    pages: 993,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'Firestarter',
    pages: 155,
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Talisman',
    pages: 334,
  },
];
