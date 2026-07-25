import client from './client';

export function register(payload) {
  return client.post('/api/users/auth/register', payload).then((r) => r.data);
}

export function login(payload) {
  return client.post('/api/users/auth/login', payload).then((r) => r.data);
}

export function getUserByEmail(email) {
  return client.get(`/api/users/by-email/${encodeURIComponent(email)}`).then((r) => r.data);
}
