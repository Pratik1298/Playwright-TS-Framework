import { test, expect } from '@playwright/test';

test('home page shows the logo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a.navbar-brand')).toBeVisible();
});

test('search finds Combination Pliers', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-query').fill('Combination Pliers');
  await page.getByTestId('search-submit').click();
  await expect(page.locator('a.card', { hasText: 'Combination Pliers' }).first()).toBeVisible();
});