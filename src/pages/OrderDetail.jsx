import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api/orders';
import StatusBadge from '../components/StatusBadge';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(() => setError('Could not load this order.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading order…</div>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Order #{order.id}</span>
          <h1>Order details</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="ticket">
        {order.items.map((item) => (
          <div className="ticket-row" key={item.id}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="ticket-total">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
