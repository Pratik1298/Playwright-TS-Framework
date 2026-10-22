import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import type { ProductPage } from '../../src/pages/ProductPage';

const PRODUCT = 'Combination Pliers';

test.describe('Product page', () => {
  let product: ProductPage;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchFor(PRODUCT);
    product = await home.openProduct(PRODUCT);
  });

  test('shows product details', async () => {
    await expect(product.productTitle).toContainText(PRODUCT);
    await expect(product.priceSection).toBeVisible();
    await expect(product.description).toBeVisible();
    await expect(product.productImage).toBeVisible();
    await expect(product.addToCartButton).toBeEnabled();
  });

  test('adding to cart updates the cart count', async () => {
    await product.addToCart();
    await expect(product.cartCount).toHaveText('1');
  });
});