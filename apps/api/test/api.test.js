import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

const req = async (method, path, { token, body } = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* no body */
  }
  return { status: res.status, json };
};

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
      resolve();
    });
  });
});

after(() => server?.close());

test('health check responds ok', async () => {
  const { status, json } = await req('GET', '/health');
  assert.equal(status, 200);
  assert.equal(json.status, 'ok');
});

test('register issues tokens and creates a user', async () => {
  const email = `test.${Date.now()}@example.com`;
  const { status, json } = await req('POST', '/auth/register', {
    body: { name: 'Test User', email, password: 'Password123!' },
  });
  assert.equal(status, 201);
  assert.ok(json.data.accessToken);
  assert.equal(json.data.user.role, 'user');
});

test('register rejects weak passwords', async () => {
  const { status } = await req('POST', '/auth/register', {
    body: { name: 'Weak', email: `weak.${Date.now()}@example.com`, password: 'weak' },
  });
  assert.equal(status, 400);
});

test('login works for a seeded admin and rejects bad credentials', async () => {
  const ok = await req('POST', '/auth/login', {
    body: { email: 'admin@avaanaspace.com', password: 'Password123!' },
  });
  assert.equal(ok.status, 200);
  assert.equal(ok.json.data.user.role, 'admin');

  const bad = await req('POST', '/auth/login', {
    body: { email: 'admin@avaanaspace.com', password: 'wrong' },
  });
  assert.equal(bad.status, 401);
});

test('RBAC blocks non-admins from admin endpoints', async () => {
  const { json } = await req('POST', '/auth/login', {
    body: { email: 'lena@example.com', password: 'Password123!' },
  });
  const token = json.data.accessToken;
  const res = await req('GET', '/admin/dashboard', { token });
  assert.equal(res.status, 403);
});

test('admins can read the dashboard', async () => {
  const { json } = await req('POST', '/auth/login', {
    body: { email: 'admin@avaanaspace.com', password: 'Password123!' },
  });
  const res = await req('GET', '/admin/dashboard', { token: json.data.accessToken });
  assert.equal(res.status, 200);
  assert.ok(res.json.data.stats.users >= 1);
});

test('discovery overview is public', async () => {
  const { status, json } = await req('GET', '/discovery');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json.data.trending));
});

test('creating a business requires auth and starts pending', async () => {
  const anon = await req('POST', '/businesses', { body: { name: 'X', category: 'Y', description: 'zzzzzzzzzz' } });
  assert.equal(anon.status, 401);

  const login = await req('POST', '/auth/login', {
    body: { email: 'lena@example.com', password: 'Password123!' },
  });
  const token = login.data?.accessToken || login.json.data.accessToken;
  const created = await req('POST', '/businesses', {
    token,
    body: { name: 'Test Biz', category: 'Retail', description: 'A great test business description.' },
  });
  assert.equal(created.status, 201);
  assert.equal(created.json.data.status, 'pending');
});

test('marketplace enquiry follows Customer -> Admin -> Business -> Admin -> Customer', async () => {
  const customer = (await req('POST', '/auth/login', { body: { email: 'lena@example.com', password: 'Password123!' } })).json.data;
  const admin = (await req('POST', '/auth/login', { body: { email: 'admin@avaanaspace.com', password: 'Password123!' } })).json.data;
  const owner = (await req('POST', '/auth/login', { body: { email: 'priya@brightbrew.com', password: 'Password123!' } })).json.data;

  // Customer opens an enquiry
  const ticket = await req('POST', '/tickets', {
    token: customer.accessToken,
    body: { businessId: 'biz_brightbrew', productId: 'prd_ethiopia', subject: 'Stock?', message: 'Is this available?' },
  });
  assert.equal(ticket.status, 201);
  const id = ticket.json.data.id;
  assert.equal(ticket.json.data.status, 'open');

  // Admin forwards to business
  const forwarded = await req('POST', `/tickets/${id}/forward`, { token: admin.accessToken, body: { body: 'Please advise.' } });
  assert.equal(forwarded.json.data.status, 'forwarded_to_business');

  // Business responds to admin
  const responded = await req('POST', `/tickets/${id}/business-reply`, { token: owner.accessToken, body: { body: 'Yes, in stock.' } });
  assert.equal(responded.json.data.status, 'business_responded');

  // Admin relays to customer and resolves
  const resolved = await req('POST', `/tickets/${id}/reply`, { token: admin.accessToken, body: { body: 'Good news — it is in stock!', resolve: true } });
  assert.equal(resolved.json.data.status, 'resolved');

  // A customer cannot forward tickets (admin-only action)
  const forbidden = await req('POST', `/tickets/${id}/forward`, { token: customer.accessToken, body: { body: 'x' } });
  assert.equal(forbidden.status, 403);
});

test('search returns grouped results and 404 handler works', async () => {
  const search = await req('GET', '/discovery/search?q=coffee');
  assert.equal(search.status, 200);
  assert.ok('businesses' in search.json.data);

  const missing = await req('GET', '/nope');
  assert.equal(missing.status, 404);
});
