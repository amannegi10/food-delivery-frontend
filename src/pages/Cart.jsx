import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';

export default function Cart() {
  const { restaurantId, restaurantName, items, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const order = await createOrder({
        userId: user.id,
        restaurantId,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place the order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <p>Browse a restaurant and add a few dishes to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">{restaurantName}</span>
          <h1>Your order</h1>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="ticket">
        {items.map((item) => (
          <div className="ticket-row" key={item.menuItemId}>
            <span>{item.name}</span>
            <div className="qty-stepper">
              <button onClick={() => updateQuantity(item.menuItemId, -1)} aria-label={`Remove one ${item.name}`}>
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, 1)} aria-label={`Add one ${item.name}`}>
                +
              </button>
            </div>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="ticket-total">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-accent" onClick={handlePlaceOrder} disabled={placing}>
          {placing ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}
