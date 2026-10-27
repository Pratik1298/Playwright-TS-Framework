import { test, expect } from '../../src/fixtures';

test.describe('Product page', () => {
  test('shows product details', async ({ productPage, productName }) => {
    await expect(productPage.productTitle).toContainText(productName);
    await expect(productPage.priceSection).toBeVisible();
    await expect(productPage.description).toBeVisible();
    await expect(productPage.productImage).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('adding to cart updates the cart count', async ({ productPage }) => {
    await productPage.addToCart();
    await expect(productPage.cartCount).toHaveText('1');
  });
});