import type { Locator, Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class HomePage {
  private readonly page: Page;
  readonly logo: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  private readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a.navbar-brand');
    this.searchBox = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.productCards = page.locator('a.card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchFor(productName: string): Promise<void> {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }
  
    async openProduct(productName: string): Promise<ProductPage> {
    await this.productCard(productName).click();
    return new ProductPage(this.page);
  }

}