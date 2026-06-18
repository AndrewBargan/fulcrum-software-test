import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BookFormDialogComponent, BookFormData } from './book-form-dialog.component';

describe('BookFormDialogComponent', () => {
  let fixture: ComponentFixture<BookFormDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const createComponent = async (data: BookFormData = {}) => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [BookFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const waitForFocus = () => new Promise((resolve) => setTimeout(resolve));
  const input = (label: string) =>
    (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      `input[aria-label="${label}"]`,
    );

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('focuses the first empty field when opened', async () => {
    await createComponent({
      book: { id: 'book-1', author: 'Existing Author', title: '' },
      isEdit: true,
    });

    await waitForFocus();

    const titleInput = input('Title');
    expect(document.activeElement).toBe(titleInput);
  });

  it('focuses author when all fields are filled', async () => {
    await createComponent({
      book: { id: 'book-1', author: 'Existing Author', title: 'Existing Title' },
      isEdit: true,
    });

    await waitForFocus();

    const authorInput = input('Author');
    expect(document.activeElement).toBe(authorInput);
  });

  it('moves focus to the next empty field when enter is pressed in a non-empty field', async () => {
    await createComponent();
    await waitForFocus();

    const authorInput = input('Author')!;
    const titleInput = input('Title')!;

    authorInput.value = 'New Author';
    authorInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    authorInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(titleInput);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('submits when enter is pressed and the form is valid', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000000');

    await createComponent();
    await waitForFocus();

    const authorInput = input('Author')!;
    const titleInput = input('Title')!;

    authorInput.value = 'New Author';
    authorInput.dispatchEvent(new Event('input'));
    titleInput.value = 'New Title';
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    titleInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(dialogRef.close).toHaveBeenCalledWith({
      id: '00000000-0000-4000-8000-000000000000',
      author: 'New Author',
      title: 'New Title',
    });
  });
});
