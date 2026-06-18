import { AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormField, form, required, min } from '@angular/forms/signals';
import { IBook } from '../../entities/interfaces';

export interface BookFormData {
  book?: IBook;
  isEdit?: boolean;
}

export type IBookData = Omit<IBook, 'id'>;

@Component({
  selector: 'app-book-form-dialog',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField],
  templateUrl: './book-form-dialog.component.html',
  styleUrl: './book-form-dialog.component.scss',
})
export class BookFormDialogComponent implements AfterViewInit {
  private dialogRef = inject(MatDialogRef<BookFormDialogComponent>);
  data = inject<BookFormData>(MAT_DIALOG_DATA as any);

  @ViewChild('authorInput') private authorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleInput') private titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pagesInput') private pagesInput!: ElementRef<HTMLInputElement>;

  private bookModel = signal<IBookData>({
    author: this.data?.book?.author ?? '',
    title: this.data?.book?.title ?? '',
    pages: this.data?.book?.pages ?? 0,
  });

  protected bookForm = form(this.bookModel, (book) => {
    required(book.author, { message: 'Author is required' });
    required(book.title, { message: 'Title is required' });
    required(book.pages, { message: 'Pages should be a number greater than 0' });
    min(book.pages, 1);
  });

  public ngAfterViewInit(): void {
    setTimeout(() => this.focusInitialField());
  }

  protected handleEnter(field: keyof IBookData, event: Event): void {
    event.preventDefault();

    const value = this.bookForm().value();
    if (!value[field]) {
      return;
    }

    if (this.bookForm().valid()) {
      this.submit();
      return;
    }

    this.focusFirstEmptyField();
  }

  protected submit(): void {
    if (this.bookForm().invalid()) {
      return;
    }

    const { author, title, pages } = this.bookForm().value();

    const result: IBook = {
      id: this.data?.book?.id ?? crypto.randomUUID(),
      author,
      title,
      pages,
    };

    this.dialogRef.close(result);
  }

  protected cancel(): void {
    this.dialogRef.close(null);
  }

  private focusInitialField(): void {
    if (!this.focusFirstEmptyField()) {
      this.authorInput.nativeElement.focus();
    }
  }

  private focusFirstEmptyField(): boolean {
    const value = this.bookForm().value();

    if (!value.author) {
      this.authorInput.nativeElement.focus();
      return true;
    }

    if (!value.title) {
      this.titleInput.nativeElement.focus();
      return true;
    }

    if (!value.pages) {
      this.pagesInput.nativeElement.focus();
      return true;
    }

    return false;
  }
}
