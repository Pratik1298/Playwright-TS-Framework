import type { Locator, Page } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';

export class ProductPage {
  private readonly page: Page;
  readonly productTitle: Locator;
  readonly priceSection: Locator;
  readonly description: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly cartCount: Locator;
  private readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.getByTestId('product-name');
    this.priceSection = page.locator('.price-section');
    this.description = page.locator('#description');
    this.productImage = page.locator('img.figure-img');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.cartCount = page.locator('#lblCartCount');
    this.cartIcon = page.getByRole('link', { name: 'cart', exact: true });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async openCart(): Promise<CheckoutPage> {
    await this.cartIcon.click();
    return new CheckoutPage(this.page);
  }
}