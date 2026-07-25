import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, getMenuItems } from '../api/restaurants';
import { useCart } from '../context/CartContext';

export default function RestaurantMenu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([getRestaurant(id), getMenuItems(id)])
      .then(([r, m]) => {
        setRestaurant(r);
        setItems(m);
      })
      .catch(() => setError('Could not load this menu.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading menu…</div>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">{restaurant.cuisine}</span>
          <h1>{restaurant.name}</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No menu items yet</h3>
          <p>This restaurant hasn't added any dishes.</p>
        </div>
      ) : (
        <div className="menu-list">
          {items.map((item) => (
            <div key={item.id} className={`menu-item ${item.available ? '' : 'unavailable'}`}>
              <div>
                <div className="menu-item-name">{item.name}</div>
                {!item.available && <div className="menu-item-flag">Currently unavailable</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="ticket-price">₹{item.price.toFixed(2)}</span>
                <button
                  className="btn btn-outline"
                  disabled={!item.available}
                  onClick={() => addItem(restaurant, item)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
