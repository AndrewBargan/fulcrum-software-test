import { expect, Page, test } from '@playwright/test';

const storeKey = 'bookStore';

const seedBooks = [
  { id: 'book-1', author: 'Ada Lovelace', title: 'Notes on Engines' },
  { id: 'book-2', author: 'Grace Hopper', title: 'Compiler Notes' },
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
    { key: storeKey, books: seedBooks },
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

  await expect(authorInput).toBeFocused();

  await authorInput.fill('Octavia Butler');
  await authorInput.press('Enter');
  await expect(titleInput).toBeFocused();

  await titleInput.fill('Kindred');
  await titleInput.press('Enter');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('row', { name: /Octavia Butler Kindred/ })).toBeVisible();
});

test('edit book dialog focuses the first field when values are filled and submits with enter', async ({
  page,
}) => {
  await page.goto('/');

  const row = page.getByRole('row', { name: /Ada Lovelace Notes on Engines/ });
  await row.getByRole('button', { name: 'Edit' }).click();

  const authorInput = page.getByRole('textbox', { name: 'Author' });
  const titleInput = page.getByRole('textbox', { name: 'Title' });

  await expect(authorInput).toBeFocused();
  await expect(authorInput).toHaveValue('Ada Lovelace');
  await expect(titleInput).toHaveValue('Notes on Engines');

  await titleInput.fill('Analytical Engine Notes');
  await titleInput.press('Enter');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('row', { name: /Ada Lovelace Analytical Engine Notes/ })).toBeVisible();
});
