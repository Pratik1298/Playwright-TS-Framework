import type { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class ProductApi extends BaseApi {
  getProducts(): Promise<APIResponse> {
    return this.get('/products');
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.get(`/products/${id}`);
  }
}