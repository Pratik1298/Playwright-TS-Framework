import { test, expect } from '../../src/fixtures';
import { DEFAULT_PRODUCT } from '../../src/utils/testData';
import type { Address } from '../../src/models/Address';

test.describe('Checkout', () => {
    test('cart shows the added product', async ({ checkoutPage, productName }) => {
    await expect(checkoutPage.cartProductTitle).toContainText(productName);
    await expect(checkoutPage.productPrice).toBeVisible();
    await expect(checkoutPage.linePrice).toBeVisible();
    await expect(checkoutPage.continueShoppingButton).toBeVisible();
  });

  test('guest checkout reaches the payment step', async ({ checkoutPage }) => {
    await checkoutPage.proceedToCheckout();
    await checkoutPage.continueAsGuest('pratik.test@example.com', 'Pratik', 'Bhosale');
    await checkoutPage.proceedAsGuest();

    const address: Address = {
      country: 'Ireland',
      postalCode: 'N37 F9H0',
      houseNumber: '123',
      street: 'Dublin Road',
      city: 'Athlone',
      state: 'Westmeath',
    };
    await checkoutPage.fillBillingAddress(address);

    await expect(checkoutPage.proceedToPaymentButton).toBeEnabled();
    await checkoutPage.proceedToPayment();
    await expect(checkoutPage.paymentMethod).toBeVisible();
  });
});