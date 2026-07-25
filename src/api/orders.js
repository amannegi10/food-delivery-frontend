import client from './client';

export function createOrder(payload) {
  return client.post('/api/orders', payload).then((r) => r.data);
}

export function getOrder(id) {
  return client.get(`/api/orders/${id}`).then((r) => r.data);
}

export function getOrdersByUser(userId) {
  return client.get(`/api/orders/user/${userId}`).then((r) => r.data);
}

export function updateOrderStatus(id, status) {
  return client.patch(`/api/orders/${id}/status`, { status }).then((r) => r.data);
}
