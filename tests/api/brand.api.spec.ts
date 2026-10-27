import { test, expect } from '../../src/fixtures';
import type { BrandApi } from '../../src/api/BrandApi';
import type { Brand, BrandRequest, SuccessResponse, ValidationErrors } from '../../src/models/api';
import { uniqueSlug } from '../../src/utils/testData';

async function createUniqueBrand(brandApi: BrandApi): Promise<Brand> {
  const response = await brandApi.createBrand({ name: 'PW Brand', slug: uniqueSlug('pw-brand') });
  expect(response.status(), `Brand should be created: ${await response.text()}`).toBe(201);
  return (await response.json()) as Brand;
}

test.describe('Brands API', () => {
  test('GET /brands returns a non-empty list', async ({ brandApi }) => {
    const response = await brandApi.getBrands();

    await expect(response).toBeOK();
    const brands = (await response.json()) as Brand[];
    expect(brands.length).toBeGreaterThan(0);
  });

  test('POST /brands creates a brand that can be fetched by ID', async ({ brandApi }) => {
    const slug = uniqueSlug('pw-brand');

    const response = await brandApi.createBrand({ name: 'PW Brand', slug });

    expect(response.status()).toBe(201);
    const created = (await response.json()) as Brand;
    expect(created.id).toBeTruthy();
    expect(created.slug).toBe(slug);

    const fetched = (await (await brandApi.getBrand(created.id)).json()) as Brand;
    expect(fetched.name).toBe('PW Brand');
  });

  test('PUT /brands/{id} replaces name and slug', async ({ brandApi }) => {
    const brand = await createUniqueBrand(brandApi);
    const newSlug = uniqueSlug('pw-updated');

    const response = await brandApi.updateBrand(brand.id, { name: 'PW Updated', slug: newSlug });

    await expect(response).toBeOK();
    expect(((await response.json()) as SuccessResponse).success).toBe(true);
    const fetched = (await (await brandApi.getBrand(brand.id)).json()) as Brand;
    expect(fetched.name).toBe('PW Updated');
    expect(fetched.slug).toBe(newSlug);
  });

  test('PATCH /brands/{id} changes only the name', async ({ brandApi }) => {
    const brand = await createUniqueBrand(brandApi);

    const response = await brandApi.patchBrand(brand.id, { name: 'PW Patched' });

    await expect(response).toBeOK();
    const fetched = (await (await brandApi.getBrand(brand.id)).json()) as Brand;
    expect(fetched.name).toBe('PW Patched');
    expect(fetched.slug, 'Slug should not change').toBe(brand.slug);
  });

  test('POST /brands with a duplicate slug is rejected', async ({ brandApi }) => {
    const existing = await createUniqueBrand(brandApi);

    const response = await brandApi.createBrand({ name: 'Duplicate', slug: existing.slug });

    expect([409, 422]).toContain(response.status());
    const errors = (await response.json()) as ValidationErrors;
    expect(errors).toHaveProperty('slug');
  });

  test('POST /brands without a name is rejected with 422', async ({ brandApi }) => {
    const invalidBrand = { slug: uniqueSlug('pw-noname') } as BrandRequest;

    const response = await brandApi.createBrand(invalidBrand);

    expect(response.status()).toBe(422);
    const errors = (await response.json()) as ValidationErrors;
    expect(errors).toHaveProperty('name');
  });
});