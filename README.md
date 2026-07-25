# Spice Route — Food Delivery Frontend

React + Vite frontend for the food-delivery microservices backend. Talks only to the API
Gateway (port 8080) — it never calls user-service, restaurant-service, or order-service directly.

## Prerequisites

- Node.js 18+
- The backend running: eureka-server, api-gateway, user-service, restaurant-service, order-service
  (see the backend's own README for startup order). **The api-gateway module in that project now
  includes a `CorsConfig.java` that allows this frontend's dev server origin — pull that file in
  if you unzipped the backend before this change.**

## Setup

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**.

## How it's wired

- `src/api/client.js` — a single axios instance pointed at `http://localhost:8080`. A request
  interceptor attaches the JWT from localStorage to every call; a response interceptor logs the
  user out automatically on a 401.
- `src/context/AuthContext.jsx` — register/login/logout, persists the JWT + user info to
  localStorage so a refresh doesn't log you out.
- `src/context/CartContext.jsx` — client-side cart. Enforces one restaurant per cart, same as
  order-service enforces one `restaurantId` per order.
- `src/pages/` — one file per screen: Login, Register, Restaurants, RestaurantMenu, Cart, Orders,
  OrderDetail.

## Flow

1. Register or log in → JWT stored, redirected to the restaurant list.
2. Click a restaurant → see its menu → add items to cart.
3. Go to Cart → adjust quantities → place order (calls `POST /api/orders`, which triggers
   order-service's Feign call into restaurant-service under the hood).
4. Orders page shows history; click into one to see live status.

## Notes for extending

- No admin UI for creating restaurants/menu items yet — use curl/Postman against the gateway
  for that (see the backend README), or ask for an admin panel next.
- Order status doesn't auto-refresh — reload the order detail page to see updates after changing
  status via the API. Polling or WebSockets would be a natural next step.
# food-delivery-system
