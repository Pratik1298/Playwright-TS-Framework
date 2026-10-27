import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type PageFixtures = {
  homePage: HomePage;
  productName: string;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  productName: async ({ homePage }, use) => {
    const productName = await homePage.firstInStockProductName();
    await use(productName);
  },

  productPage: async ({ homePage, productName }, use) => {
    const productPage = await homePage.openProduct(productName);
    await use(productPage);
  },

  checkoutPage: async ({ productPage }, use) => {
    await productPage.addToCart();
    await expect(productPage.cartCount).toHaveText('1');
    const checkoutPage = await productPage.openCart();
    await use(checkoutPage);
  },
});

export { expect };