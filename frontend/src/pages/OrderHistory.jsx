import { useEffect, useState } from 'react';
import { orderAPI } from '../utils/api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  if (loading) return <div className="container"><p>Loading orders...</p></div>;

  return (
    <div className="order-history">
      <div className="container">
        <h1>Order History</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`order-status ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product?.name || 'Product'}</td>
                          <td>{item.quantity}</td>
                          <td>Rs. {item.price.toFixed(2)}</td>
                          <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
