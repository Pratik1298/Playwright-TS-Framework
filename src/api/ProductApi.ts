import type { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';
import type { ProductRequest } from '../models/api';

export class ProductApi extends BaseApi {
  getProducts(): Promise<APIResponse> {
    return this.get('/products');
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.get(`/products/${id}`);
  }
  
  createProduct(product: ProductRequest): Promise<APIResponse> {
    return this.post('/products', product);
  }

  patchProduct(id: string, fields: Partial<ProductRequest>): Promise<APIResponse> {
    return this.patch(`/products/${id}`, fields);
  }
}