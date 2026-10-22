import type { Locator, Page } from '@playwright/test';
import type { Address } from '../models/Address';

export class CheckoutPage {
  // Step 1: Cart
  readonly cartProductTitle: Locator;
  readonly productPrice: Locator;
  readonly linePrice: Locator;
  readonly continueShoppingButton: Locator;
  private readonly proceedToCheckoutButton: Locator;

  // Step 2: Sign in as guest
  private readonly continueAsGuestTab: Locator;
  private readonly guestEmail: Locator;
  private readonly guestFirstName: Locator;
  private readonly guestLastName: Locator;
  private readonly continueAsGuestButton: Locator;
  private readonly proceedAsGuestButton: Locator;

  // Step 3: Billing address
  private readonly country: Locator;
  private readonly postalCode: Locator;
  private readonly houseNumber: Locator;
  private readonly street: Locator;
  private readonly city: Locator;
  private readonly state: Locator;
  readonly proceedToPaymentButton: Locator;

  // Step 4: Payment
  readonly paymentMethod: Locator;

  constructor(page: Page) {
    this.cartProductTitle = page.locator('span.product-title');
    this.productPrice = page.getByTestId('product-price');
    this.linePrice = page.getByTestId('line-price');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to checkout' });

    this.continueAsGuestTab = page.locator("//a[text()='Continue as Guest']");
    this.guestEmail = page.locator('#guest-email');
    this.guestFirstName = page.locator('#guest-first-name');
    this.guestLastName = page.locator('#guest-last-name');
    this.continueAsGuestButton = page.getByRole('button', { name: 'Continue as Guest' });
    this.proceedAsGuestButton = page.getByTestId('proceed-2-guest');

    this.country = page.locator('#country');
    this.postalCode = page.locator('#postal_code');
    this.houseNumber = page.locator('#house_number');
    this.street = page.locator('#street');
    this.city = page.locator('#city');
    this.state = page.locator('#state');
    this.proceedToPaymentButton = page.getByTestId('proceed-3');

    this.paymentMethod = page.getByTestId('payment-method');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async continueAsGuest(email: string, firstName: string, lastName: string): Promise<void> {
    await this.continueAsGuestTab.click();
    await this.guestEmail.fill(email);
    await this.guestFirstName.fill(firstName);
    await this.guestLastName.fill(lastName);
    await this.continueAsGuestButton.click();
  }

  async proceedAsGuest(): Promise<void> {
    await this.proceedAsGuestButton.click();
  }

  async fillBillingAddress(address: Address): Promise<void> {
    await this.country.selectOption(address.country);
    await this.postalCode.fill(address.postalCode);
    await this.houseNumber.fill(address.houseNumber);
    await this.street.fill(address.street);
    await this.city.fill(address.city);
    if (address.state) {
      await this.state.fill(address.state);
    }
  }

  async proceedToPayment(): Promise<void> {
    await this.proceedToPaymentButton.click();
  }
}