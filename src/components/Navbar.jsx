import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Spice<span>Route</span>
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Restaurants</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/cart" className="cart-pill">
              Cart · {totalCount}
            </Link>
            <button className="link-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn btn-accent" style={{ padding: '8px 16px' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
