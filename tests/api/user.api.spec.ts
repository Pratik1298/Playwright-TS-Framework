import { test, expect } from '../../src/fixtures';
import type { LoginResponse, UserProfile } from '../../src/models/api';

const EMAIL = 'customer@practicesoftwaretesting.com';
const PASSWORD = 'welcome01';

test.describe('Users API', () => {
  test('login with valid credentials returns a bearer token', async ({ userApi }) => {
    const response = await userApi.login({ email: EMAIL, password: PASSWORD });

    await expect(response).toBeOK();
    const login = (await response.json()) as LoginResponse;
    expect(login.token_type).toBe('bearer');
    expect(login.access_token).toBeTruthy();
    expect(login.expires_in).toBeGreaterThan(0);
  });

  test('login with a wrong password is rejected with 401', async ({ userApi }) => {
    const response = await userApi.login({ email: EMAIL, password: 'wrong-password' });

    expect(response.status()).toBe(401);
  });

  test('GET /users/me returns the logged-in user', async ({ userApi }) => {
    userApi.setToken(await userApi.loginAndGetToken(EMAIL, PASSWORD));

    const response = await userApi.getProfile();

    await expect(response).toBeOK();
    const profile = (await response.json()) as UserProfile;
    expect(profile.email).toBe(EMAIL);
    expect(profile.first_name).toBe('Jane');
  });

  test('GET /users/me without a token is rejected with 401', async ({ userApi }) => {
    const response = await userApi.getProfile();

    expect(response.status()).toBe(401);
  });
});