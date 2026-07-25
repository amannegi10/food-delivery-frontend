import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByUser } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrdersByUser(user.id)
      .then((data) => setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="loading-state">Loading your orders…</div>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Your history</span>
          <h1>Orders</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Once you place an order, it'll show up here.</p>
        </div>
      ) : (
        orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="order-row">
            <div>
              <div className="order-id">Order #{order.id}</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                ₹{order.totalAmount.toFixed(2)}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        ))
      )}
    </div>
  );
}
