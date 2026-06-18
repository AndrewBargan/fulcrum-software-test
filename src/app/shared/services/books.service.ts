import { inject, Injectable } from '@angular/core';
import { js2xml, Options, xml2js } from 'xml-js';
import { BookStore } from '../store/book-store';
import { IBook, IBookFromXml, IImportBooksResult } from '../entities/interfaces';
import { EXPORT_BOOKS_XML_FILE_NAME } from '../entities/constants';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  store = inject(BookStore);

  public importBooks(): Promise<IImportBooksResult> {
    return new Promise((resolve) => {
      if (typeof window.FileReader !== 'function') {
        return resolve({
          unsupportedBrowser: true,
        });
      }

      let fileUploadInputElement: HTMLInputElement | null = this.createHiddenInputFileElement();
      let handled = false;

      document.body.appendChild(fileUploadInputElement);

      const removeHiddenInputFileElement = () => {
        if (!fileUploadInputElement) {
          return;
        }

        fileUploadInputElement.removeEventListener('change', onChange);
        window.removeEventListener('focus', filePickedOrCanceled);

        document.body.removeChild(fileUploadInputElement);

        fileUploadInputElement = null;
      };

      const onChange = () => {
        if (handled) {
          return;
        }

        const file = fileUploadInputElement?.files?.[0];

        if (!file) {
          handled = true;
          removeHiddenInputFileElement();

          resolve({
            importedCount: 0,
            skippedCount: 0,
          });

          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          if (handled) {
            return;
          }

          try {
            handled = true;

            removeHiddenInputFileElement();

            const xmlData = reader.result as string;

            const parsedResult = xml2js(xmlData, { compact: true });

            const books = [].concat((parsedResult as any)?.books?.book ?? []);

            const result = this.addImportedBooks(books);

            resolve(result);
          } catch (error) {
            handled = true;

            removeHiddenInputFileElement();

            resolve({
              wrongXmlFileFormat: true,
            });
          }
        };

        reader.onerror = () => {
          if (handled) {
            return;
          }

          handled = true;

          removeHiddenInputFileElement();

          resolve({ wrongXmlFileFormat: true });
        };

        reader.readAsText(file);
      };

      const filePickedOrCanceled = () => {
        if (handled || !fileUploadInputElement) {
          return;
        }

        // 1000 ms delay needed to allow file list to populate and onChange to fire
        setTimeout(() => {
          if (handled) {
            return;
          }

          // If files were selected, let onChange handle it
          if (fileUploadInputElement?.files?.length) {
            return;
          }

          handled = true;

          resolve({
            importCanceled: true,
          });

          removeHiddenInputFileElement();
        }, 1000);
      };

      fileUploadInputElement.addEventListener('change', onChange);
      window.addEventListener('focus', filePickedOrCanceled);

      fileUploadInputElement.click();
    });
  }

  public exportBooks(): void {
    const books = this.store.filteredBooks();

    const options: Options.JS2XML = { compact: true, spaces: 2 };

    const booksXml = js2xml(
      {
        books: {
          book: books,
        },
      },
      options,
    );

    const blob = new Blob([booksXml], { type: 'text/xml;charset=UTF-8' });
    const href = URL.createObjectURL(blob);

    const element = this.createHiddenElement('a', {
      href,
      download: EXPORT_BOOKS_XML_FILE_NAME,
    });

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    URL.revokeObjectURL(href);
  }

  private createHiddenInputFileElement(): HTMLInputElement {
    return this.createHiddenElement('input', {
      type: 'file',
      accept: 'text/xml',
    }) as HTMLInputElement;
  }

  private createHiddenElement(elName: string, attributes: { [key: string]: string }): HTMLElement {
    const element = document.createElement(elName);

    element.style.display = 'none';

    for (const [attr, value] of Object.entries(attributes)) {
      element.setAttribute(attr, value);
    }

    return element;
  }

  private isBookFromXml(obj: any): obj is IBookFromXml {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      typeof obj.id?._text === 'string' &&
      typeof obj.author?._text === 'string' &&
      typeof obj.title?._text === 'string' &&
      typeof obj.pages?._text === 'string'
    );
  }

  private addImportedBooks(booksRaw: IBookFromXml[]): IImportBooksResult {
    if (!Array.isArray(booksRaw) || !booksRaw.every(this.isBookFromXml)) {
      return {
        wrongXmlFileFormat: true,
      };
    }

    const books: Record<string, IBook> = booksRaw.reduce(
      (acc, el) => {
        const id = el.id._text;

        acc[id] = {
          id,
          author: el.author._text,
          title: el.title._text,
          pages: Number(el.pages?._text),
        };

        return acc;
      },
      {} as Record<string, IBook>,
    );

    let skippedCount = 0;

    this.store.books().forEach((book) => {
      if (books[book.id]) {
        skippedCount++;
        delete books[book.id];
      }
    });

    const newBooks = Object.values(books);

    this.store.addBooks(newBooks);

    return {
      importedCount: newBooks.length,
      skippedCount,
    };
  }
}
