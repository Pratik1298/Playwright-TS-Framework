import type { Locator, Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class HomePage {
  private readonly page: Page;
  readonly logo: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  private readonly productCards: Locator;
  private readonly inStockCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a.navbar-brand');
    this.searchBox = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.productCards = page.locator('a.card');
    this.inStockCards = this.productCards.filter({ hasNot: page.getByTestId('out-of-stock') });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchFor(productName: string): Promise<void> {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
  }

  productCard(productName: string): Locator {
    return this.productCards
      .filter({ has: this.page.getByTestId('product-name').getByText(productName, { exact: true }) })
      .first();
  }

  async firstInStockProductName(): Promise<string> {
    const name = await this.inStockCards.first().getByTestId('product-name').innerText();
    return name.trim();
  }

  async openProduct(productName: string): Promise<ProductPage> {
    await this.productCard(productName).click();
    return new ProductPage(this.page);
  }
}