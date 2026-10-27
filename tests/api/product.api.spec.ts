import { test, expect } from '../../src/fixtures';
import type { PaginatedProducts, Product } from '../../src/models/api';

test.describe('Products API', () => {
  test('GET /products returns a non-empty list with valid prices', async ({ productApi }) => {
    const response = await productApi.getProducts();

    await expect(response).toBeOK();
    const page = (await response.json()) as PaginatedProducts;
    expect(page.data.length).toBeGreaterThan(0);
    expect(page.data.every((product) => product.price > 0)).toBe(true);
  });

  test('GET /products/{id} returns the same product as the list', async ({ productApi }) => {
    const list = (await (await productApi.getProducts()).json()) as PaginatedProducts;
    const first = list.data[0];

    const response = await productApi.getProduct(first.id);

    await expect(response).toBeOK();
    const product = (await response.json()) as Product;
    expect(product.id).toBe(first.id);
    expect(product.name).toBe(first.name);
    expect(product.brand).toBeDefined();
  });
});