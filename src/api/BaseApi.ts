import { test, type APIRequestContext, type APIResponse } from '@playwright/test';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export abstract class BaseApi {
  private token?: string;

  constructor(protected readonly request: APIRequestContext) {}

  setToken(token: string): void {
    this.token = token;
  }

  protected get(path: string): Promise<APIResponse> {
    return this.send('GET', path);
  }

  protected post(path: string, body: unknown): Promise<APIResponse> {
    return this.send('POST', path, body);
  }

  protected put(path: string, body: unknown): Promise<APIResponse> {
    return this.send('PUT', path, body);
  }

  protected patch(path: string, body: unknown): Promise<APIResponse> {
    return this.send('PATCH', path, body);
  }

  protected delete(path: string): Promise<APIResponse> {
    return this.send('DELETE', path);
  }

  private async send(method: HttpMethod, path: string, body?: unknown): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return test.step(`${method} ${path}`, async () => {
      if (body !== undefined) {
        await test.info().attach('Request body', {
          body: JSON.stringify(body, null, 2),
          contentType: 'application/json',
        });
      }

      const response = await this.request.fetch(path, { method, headers, data: body });

      await test.info().attach(`Response ${response.status()}`, {
        body: await response.text(),
        contentType: 'application/json',
      });
      return response;
    });
  }
}