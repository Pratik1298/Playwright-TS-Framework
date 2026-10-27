import { randomUUID } from 'node:crypto';
import type { Product, ProductRequest } from '../models/api';

export const DEFAULT_PRODUCT = 'Combination Pliers';

export function uniqueSuffix(): string {
  return randomUUID().slice(0, 8);
}

export function uniqueEmail(): string {
  return `pw.test.${uniqueSuffix()}@example.com`;
}

export function uniqueSlug(prefix: string): string {
  return `${prefix}-${uniqueSuffix()}`;
}

export function strongPassword(): string {
  return `Pw!${uniqueSuffix()}Zz9`;
}

export function productRequestFrom(reference: Product, name: string, price: number): ProductRequest {
  return {
    name,
    description: 'Created by Playwright API test',
    price,
    category_id: reference.category.id,
    brand_id: reference.brand.id,
    product_image_id: reference.product_image.id,
    is_location_offer: false,
    is_rental: false,
    co2_rating: 'C',
  };
}