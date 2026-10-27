import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import type { APIRequestContext } from '@playwright/test';
import { UserApi } from '../api/UserApi';
import { ProductApi } from '../api/ProductApi';
import { API_URL } from '../utils/env';

type PageFixtures = {
  homePage: HomePage;
  productName: string;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

type ApiFixtures = {
  apiContext: APIRequestContext;
  userApi: UserApi;
  productApi: ProductApi;
};

export const test = base.extend<PageFixtures & ApiFixtures>({
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
  
  apiContext: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    await use(apiContext);
    await apiContext.dispose();
  },

  userApi: async ({ apiContext }, use) => {
    await use(new UserApi(apiContext));
  },

  productApi: async ({ apiContext }, use) => {
    await use(new ProductApi(apiContext));
  },
});

export { expect };