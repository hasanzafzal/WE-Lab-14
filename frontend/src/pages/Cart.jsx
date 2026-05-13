import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../utils/api';

export default function Cart() {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };

      const response = await orderAPI.create(orderData);
      if (response.data) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      setError('Failed to place order: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart empty-cart">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p className="empty-message">Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <h1>Shopping Cart</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="cart-content">
          <div className="cart-items-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="product-name">{item.name}</td>
                    <td className="product-price">Rs. {item.price.toFixed(2)}</td>
                    <td className="product-quantity">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item._id, parseInt(e.target.value))
                        }
                        className="qty-input"
                      />
                    </td>
                    <td className="product-subtotal">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="product-action">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (0%):</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
                className="btn btn-primary place-order-btn"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <Link to="/" className="btn btn-secondary continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
