import { test, expect } from '../../src/fixtures';
import { DEFAULT_PRODUCT } from '../../src/utils/testData';

test.describe('Home page', () => {
  test('opens on the base URL', async ({ homePage, page, baseURL }) => {
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test('shows the logo', async ({ homePage }) => {
    await expect(homePage.logo).toBeVisible();
  });

  test('search finds Combination Pliers', async ({ homePage }) => {
    await expect(homePage.searchBox).toBeVisible();
    await homePage.searchFor(DEFAULT_PRODUCT);
    await expect(homePage.productCard(DEFAULT_PRODUCT)).toBeVisible();
  });
});