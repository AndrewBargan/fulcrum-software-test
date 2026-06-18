import { EOrder } from './enums';
import { IBook } from './interfaces';

export type BookStoreState = {
  books: IBook[];
  filter: { query: string; authorOrder: EOrder; titleOrder: EOrder };
};
