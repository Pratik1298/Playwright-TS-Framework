import type { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';
import type { LoginRequest, LoginResponse } from '../models/api';

export class UserApi extends BaseApi {
  login(credentials: LoginRequest): Promise<APIResponse> {
    return this.post('/users/login', credentials);
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await this.login({ email, password });
    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}`);
    }
    const body = (await response.json()) as LoginResponse;
    return body.access_token;
  }

  getProfile(): Promise<APIResponse> {
    return this.get('/users/me');
  }
}