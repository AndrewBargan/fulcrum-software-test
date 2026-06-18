import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IBook } from '../../entities/interfaces';

export interface BookFormData {
  book?: IBook;
  isEdit?: boolean;
}

@Component({
  selector: 'app-book-form-dialog',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './book-form-dialog.component.html',
  styleUrl: './book-form-dialog.component.scss',
})
export class BookFormDialogComponent {
  private dialogRef = inject(MatDialogRef<BookFormDialogComponent>);
  data = inject<BookFormData>(MAT_DIALOG_DATA as any);

  author = signal(this.data?.book?.author ?? '');
  title = signal(this.data?.book?.title ?? '');

  invalid = computed(() => !this.author() || !this.title());

  submit() {
    if (this.invalid()) {
      return;
    }

    const result: IBook = {
      id: this.data?.book?.id ?? crypto.randomUUID(),
      author: this.author(),
      title: this.title(),
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
