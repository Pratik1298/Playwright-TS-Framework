import type { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';
import type { BrandRequest } from '../models/api';

export class BrandApi extends BaseApi {
  getBrands(): Promise<APIResponse> {
    return this.get('/brands');
  }

  getBrand(id: string): Promise<APIResponse> {
    return this.get(`/brands/${id}`);
  }

  createBrand(brand: BrandRequest): Promise<APIResponse> {
    return this.post('/brands', brand);
  }

  updateBrand(id: string, brand: BrandRequest): Promise<APIResponse> {
    return this.put(`/brands/${id}`, brand);
  }

  patchBrand(id: string, fields: Partial<BrandRequest>): Promise<APIResponse> {
    return this.patch(`/brands/${id}`, fields);
  }
}