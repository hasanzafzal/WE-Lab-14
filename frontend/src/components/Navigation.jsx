import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Debug: log the user object to understand its structure
  if (user) {
    console.log('Current user object:', user);
  }

  // Check admin status - try multiple ways to be safe
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true || localStorage.getItem('userRole') === 'admin';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="navbar-brand">
          <h2>H-Autostore</h2>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart" className="cart-link">
              Cart ({itemCount})
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li className="user-menu">
                <span>{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
