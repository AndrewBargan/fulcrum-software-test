import { expect, Page, test } from '@playwright/test';
import { BOOK_STORE_STATE_KEY } from '../src/app/shared/entities/constants';

const seedBooks = [
  { id: 'book-1', author: 'Hans Christian Andersen', title: 'The Little Mermaid', pages: 122 },
  { id: 'book-2', author: 'Stephen King', title: 'The Long Walk', pages: 743 },
];

const seedBookStore = async (page: Page) => {
  await page.addInitScript(
    ({ key, books }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          books,
          filter: { query: '', authorOrder: 'asc', titleOrder: 'asc' },
        }),
      );
    },
    { key: BOOK_STORE_STATE_KEY, books: seedBooks },
  );
};

test.beforeEach(async ({ page }) => {
  await seedBookStore(page);
});

test('add book dialog focuses first empty field and submits with enter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Add Book' }).click();

  const authorInput = page.getByRole('textbox', { name: 'Author' });
  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const pagesInput = page.getByRole('spinbutton', { name: 'Pages' });

  await expect(authorInput).toBeFocused();

  await authorInput.fill('Stephen King');
  await authorInput.press('Enter');
  await expect(titleInput).toBeFocused();

  await titleInput.fill('Firestarter');
  await titleInput.press('Enter');
  await expect(pagesInput).toBeFocused();

  await pagesInput.fill('443');
  await pagesInput.press('Enter');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('row', { name: /Stephen King Firestarter/ })).toBeVisible();
});

test('edit book dialog focuses the first field when values are filled and submits with enter', async ({
  page,
}) => {
  await page.goto('/');

  const row = page.getByRole('row', { name: /Hans Christian Andersen The Little Mermaid/ });
  await row.getByRole('button', { name: 'Edit' }).click();

  const authorInput = page.getByRole('textbox', { name: 'Author' });
  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const pagesInput = page.getByRole('spinbutton', { name: 'Pages' });

  await expect(authorInput).toBeFocused();
  await expect(authorInput).toHaveValue('Hans Christian Andersen');
  await expect(titleInput).toHaveValue('The Little Mermaid');
  await expect(pagesInput).toHaveValue('122');

  await titleInput.fill('The Ugly Duckling');
  await titleInput.press('Enter');

  await pagesInput.fill('125');
  await pagesInput.press('Enter');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(
    page.getByRole('row', { name: /Hans Christian Andersen The Ugly Duckling/ }),
  ).toBeVisible();
});
