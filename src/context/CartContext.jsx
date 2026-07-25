import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

// A cart can only hold items from one restaurant at a time — this mirrors
// how order-service works (one order = one restaurantId), and matches how
// every real food delivery app behaves.
export function CartProvider({ children }) {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);
  const [items, setItems] = useState([]); // { menuItemId, name, price, quantity }

  const addItem = useCallback((restaurant, item) => {
    setItems((prev) => {
      const isDifferentRestaurant = restaurantId && restaurantId !== restaurant.id;
      const base = isDifferentRestaurant ? [] : prev;

      const existing = base.find((i) => i.menuItemId === item.id);
      if (existing) {
        return base.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...base, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setRestaurantId(restaurant.id);
    setRestaurantName(restaurant.name);
  }, [restaurantId]);

  const updateQuantity = useCallback((menuItemId, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  }, []);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ restaurantId, restaurantName, items, addItem, updateQuantity, clearCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
