import { test, expect } from '../../src/fixtures';
import type { ProductApi } from '../../src/api/ProductApi';
import type { PaginatedProducts, Product, ProductRequest, ValidationErrors } from '../../src/models/api';
import { productRequestFrom, uniqueSuffix } from '../../src/utils/testData';

async function referenceProduct(productApi: ProductApi): Promise<Product> {
  const list = (await (await productApi.getProducts()).json()) as PaginatedProducts;
  return (await (await productApi.getProduct(list.data[0].id)).json()) as Product;
}

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

    test('POST /products creates a product using IDs from existing data', async ({ productApi }) => {
    const reference = await referenceProduct(productApi);
    const name = `PW Wire Cutter ${uniqueSuffix()}`;

    const response = await productApi.createProduct(productRequestFrom(reference, name, 12.99));

    expect(response.status(), `Product should be created: ${await response.text()}`).toBe(201);
    const created = (await response.json()) as Product;
    const fetched = (await (await productApi.getProduct(created.id)).json()) as Product;
    expect(fetched.name).toBe(name);
    expect(fetched.price).toBeCloseTo(12.99, 2);
    expect(fetched.brand.id).toBe(reference.brand.id);
    expect(fetched.category.id).toBe(reference.category.id);
  });

    test('PATCH /products/{id} changes only the price', async ({ productApi }) => {
    const reference = await referenceProduct(productApi);
    const name = `PW Patch Target ${uniqueSuffix()}`;
    const createResponse = await productApi.createProduct(productRequestFrom(reference, name, 10));
    expect(createResponse.status(), `Setup failed: ${await createResponse.text()}`).toBe(201);
    const created = (await createResponse.json()) as Product;

    const response = await productApi.patchProduct(created.id, { price: 19.99 });

    await expect(response).toBeOK();
    const fetched = (await (await productApi.getProduct(created.id)).json()) as Product;
    expect(fetched.price).toBeCloseTo(19.99, 2);
    expect(fetched.name, 'Name should not change').toBe(name);
  });

  test('POST /products without required fields is rejected with 422', async ({ productApi }) => {
    const incomplete = { name: 'Incomplete', price: 5 } as ProductRequest;

    const response = await productApi.createProduct(incomplete);

    expect(response.status()).toBe(422);
    const errors = (await response.json()) as ValidationErrors;
    expect(errors).toHaveProperty('category_id');
    expect(errors).toHaveProperty('brand_id');
  });
});