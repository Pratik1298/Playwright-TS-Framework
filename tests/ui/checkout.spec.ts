import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import type { CheckoutPage } from '../../src/pages/CheckoutPage';
import type { Address } from '../../src/models/Address';

const PRODUCT = 'Combination Pliers';

test.describe('Checkout', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchFor(PRODUCT);
    const product = await home.openProduct(PRODUCT);
    await product.addToCart();
    await expect(product.cartCount).toHaveText('1');
    checkout = await product.openCart();
  });

  test('cart shows the added product', async () => {
    await expect(checkout.cartProductTitle).toContainText(PRODUCT);
    await expect(checkout.productPrice).toBeVisible();
    await expect(checkout.linePrice).toBeVisible();
    await expect(checkout.continueShoppingButton).toBeVisible();
  });

  test('guest checkout reaches the payment step', async () => {
    await checkout.proceedToCheckout();
    await checkout.continueAsGuest('pratik.test@example.com', 'Pratik', 'Bhosale');
    await checkout.proceedAsGuest();

    const address: Address = {
      country: 'Ireland',
      postalCode: 'N37 F9H0',
      houseNumber: '123',
      street: 'Dublin Road',
      city: 'Athlone',
      state: 'Westmeath',
    };
    await checkout.fillBillingAddress(address);

    await expect(checkout.proceedToPaymentButton).toBeEnabled();
    await checkout.proceedToPayment();
    await expect(checkout.paymentMethod).toBeVisible();
  });
});