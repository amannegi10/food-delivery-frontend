import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../api/restaurants';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(() => setError('Could not load restaurants. Is restaurant-service running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Where to today</span>
          <h1>Restaurants</h1>
        </div>
      </div>

      {loading && <div className="loading-state">Loading restaurants…</div>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && restaurants.length === 0 && (
        <div className="empty-state">
          <h3>No restaurants yet</h3>
          <p>Add one via the API and it'll show up here.</p>
        </div>
      )}

      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <Link key={r.id} to={`/restaurants/${r.id}`} className="restaurant-card">
            <span className="cuisine-tag">{r.cuisine}</span>
            <h3>{r.name}</h3>
            <div className="address">{r.address}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
