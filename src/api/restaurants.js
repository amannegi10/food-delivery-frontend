import client from './client';

export function getRestaurants() {
  return client.get('/api/restaurants').then((r) => r.data);
}

export function getRestaurant(id) {
  return client.get(`/api/restaurants/${id}`).then((r) => r.data);
}

export function getMenuItems(restaurantId) {
  return client.get(`/api/restaurants/${restaurantId}/menu-items`).then((r) => r.data);
}
