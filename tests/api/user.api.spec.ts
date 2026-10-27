import { test, expect } from '../../src/fixtures';
import type { LoginResponse, UserProfile, ValidationErrors } from '../../src/models/api';
import { strongPassword, uniqueEmail } from '../../src/utils/testData';


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
    test('a newly registered user can log in and read their profile', async ({ userApi }) => {
    const email = uniqueEmail();
    const password = strongPassword();

    const registerResponse = await userApi.register({
      first_name: 'Pratik',
      last_name: 'Tester',
      dob: '1998-05-12',
      phone: '0871234567',
      email,
      password,
    });
    expect(registerResponse.status(), `Registration failed: ${await registerResponse.text()}`).toBe(201);

    userApi.setToken(await userApi.loginAndGetToken(email, password));
    const profile = (await (await userApi.getProfile()).json()) as UserProfile;
    expect(profile.email).toBe(email);
    expect(profile.first_name).toBe('Pratik');
  });

  test('registering with an existing email is rejected', async ({ userApi }) => {
    const response = await userApi.register({
      first_name: 'Jane',
      last_name: 'Doe',
      dob: '1990-01-01',
      phone: '0871234567',
      email: EMAIL,
      password: strongPassword(),
    });

    expect([409, 422]).toContain(response.status());
    const errors = (await response.json()) as ValidationErrors;
    expect(errors).toHaveProperty('email');
  });
});