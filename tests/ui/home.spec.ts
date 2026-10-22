import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Home page', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('opens on the base URL', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test('shows the logo', async () => {
    await expect(home.logo).toBeVisible();
  });
 
  test('search finds Combination Pliers', async () => {
    await expect(home.searchBox).toBeVisible();
    await home.searchFor('Combination Pliers');
    await expect(home.productCard('Combination Pliers')).toBeVisible();
  });
});