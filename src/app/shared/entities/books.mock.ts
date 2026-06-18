import { IBook } from './interfaces';

export const INITIAL_BOOKS: IBook[] = [
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Ugly Duckling',
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Little Mermaid',
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: "The Emperor's New Clothes",
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Snow Queen',
  },
  {
    id: crypto.randomUUID(),
    author: 'Hans Christian Andersen',
    title: 'The Little Match Girl',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Shining',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'It',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Stand',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'Carrie',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Long Walk',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Dead Zone',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'Firestarter',
  },
  {
    id: crypto.randomUUID(),
    author: 'Stephen King',
    title: 'The Talisman',
  },
];
